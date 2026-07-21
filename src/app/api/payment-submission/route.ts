export const runtime = 'nodejs';
import { NextRequest } from "next/server";
import { paymentSubmissionSchema } from "@/lib/validation";
import { resend } from "@/lib/resend";
import { getAdminEmailHtml, getAdminEmailText, getStudentEmailHtml } from "@/lib/emailTemplates";
import { apiResponse } from "@/lib/api-utils";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/validation";
import { getStorageProvider } from "@/lib/storage";
import { leadsService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";
import { getLocalCacheHelper } from "@/lib/api-utils";
import { Lead } from "@/types";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<Lead>("leads.json");

const DEFAULT_FROM_EMAIL = "DevPhoenix Academy <academy@devphoenix.com>";


function getSender(label: string, fromEnv?: string) {
  const baseEmail = fromEnv || DEFAULT_FROM_EMAIL;
  const emailMatch = baseEmail.match(/<([^>]+)>/) || [null, baseEmail];
  const email = (emailMatch[1] || baseEmail).trim();
  return `${label} <${email}>`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extract fields
    const fullName = formData.get("fullName") as string;
    const collegeName = formData.get("collegeName") as string;
    const domainOfInterest = formData.get("domainOfInterest") as string;
    const modeOfPayment = formData.get("modeOfPayment") as string;
    const transactionId = formData.get("transactionId") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const whatsAppNumber = formData.get("whatsAppNumber") as string;
    const emailAddress = formData.get("emailAddress") as string;
    const declaration = formData.get("declaration") === "true";
    
    const file = formData.get("screenshot") as File | null;
    
    // 1. Validate fields using Zod
    const validatedData = paymentSubmissionSchema.safeParse({
      fullName,
      collegeName,
      domainOfInterest,
      modeOfPayment,
      transactionId,
      phoneNumber,
      whatsAppNumber,
      emailAddress,
      declaration,
    });
    
    if (!validatedData.success) {
      const errorMsg = validatedData.error.issues[0]?.message || "Invalid form data";
      return apiResponse.badRequest(errorMsg, "VALIDATION_FAILED", validatedData.error.issues);
    }
    
    // 2. Validate file
    if (!file) {
      return apiResponse.badRequest("Payment screenshot is required.", "FILE_REQUIRED");
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return apiResponse.badRequest("Screenshot file size exceeds the 10MB limit.", "FILE_TOO_LARGE");
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return apiResponse.badRequest(
        `Invalid file format. Only JPG, JPEG, PNG, and PDF files are allowed. Got type: ${file.type}`,
        "INVALID_FILE_TYPE"
      );
    }
    
    // Read the file as an arrayBuffer and convert to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 3. Format Date
    const dateString = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long",
    });

    // Upload screenshot using StorageProvider
    let screenshotUrl = "";
    try {
      const storage = getStorageProvider();
      screenshotUrl = await storage.uploadFile(buffer, file.name, file.type);
      console.log(`✅ Payment screenshot uploaded successfully: ${screenshotUrl}`);
    } catch (uploadErr) {
      console.error("❌ Failed to upload screenshot to local storage:", uploadErr);
    }
    
    // Persist as a Lead in MongoDB/local JSON cache so submission is never lost
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: fullName,
      email: emailAddress,
      phone: phoneNumber,
      whatsapp: whatsAppNumber,
      program: domainOfInterest,
      college: collegeName || "",
      status: "New",
      payment_status: "Pending Verification",
      payment_amount: 1249, // default package pricing fallback
      current_status: "Paid (Pending Verification)",
      message: `Submitted via Public Payment Submission page. Mode: ${modeOfPayment}, Transaction ID: ${transactionId}`,
      source_page: "payment_submission",
      source_campaign: "payment_page",
      notes: [
        {
          id: `note-${Date.now()}`,
          content: `Payment submitted. Mode: ${modeOfPayment}. Transaction ID: ${transactionId}. Screenshot: ${screenshotUrl}`,
          created_at: new Date().toISOString(),
          author: "System"
        }
      ],
      custom_fields: {
        modeOfPayment,
        transactionId,
        screenshotUrl,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (hasMongoConfig) {
      try {
        await leadsService.create(newLead);
        console.log("✅ Lead auto-created in MongoDB");
      } catch (dbErr) {
        console.error("❌ MongoDB Lead Auto-Creation failed:", dbErr);
      }
    } else {
      try {
        const list = cache.read();
        list.unshift(newLead);
        cache.write(list);
        console.log("✅ Lead auto-created in local cache");
      } catch (cacheErr) {
        console.error("❌ Local Cache Lead Auto-Creation failed:", cacheErr);
      }
    }

    const emailData = {
      fullName,
      collegeName,
      domainOfInterest,
      modeOfPayment,
      transactionId,
      phoneNumber,
      whatsAppNumber,
      emailAddress,
      dateString,
    };
    
    const adminHtml = getAdminEmailHtml(emailData);
    const adminText = getAdminEmailText(emailData);
    const studentHtml = getStudentEmailHtml(emailData);
    
    // Get sender email identity configured in Resend console
    const fromEmailAdmin = getSender("DevPhoeniX Alerts", process.env.RESEND_FROM_EMAIL);
    const fromEmailUser = getSender("DEVPHOENIX Team", process.env.RESEND_FROM_EMAIL);
    
    // Check if Resend API key is present
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
      console.warn("⚠️ RESEND_API_KEY is not configured or placeholder. Running email dispatch in simulated mode.");
      console.log(`
--- SIMULATED ADMIN PAYMENT EMAIL ---
From: ${fromEmailAdmin}
To: devphoenix@zohomail.in
Reply-To: ${emailAddress}
Subject: New Payment Submission | DEVPHOENIX Academy
Attachment Name: ${file.name}
Attachment Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB
Content:
${adminText}
-------------------------------------

--- SIMULATED STUDENT EMAIL ---
From: ${fromEmailUser}
To: ${emailAddress}
Subject: Payment Submission Received | DEVPHOENIX Academy
-------------------------------
      `);
      
      return apiResponse.success({
        message: "Payment submission received and registered in CRM (Simulated email transmission).",
        simulated: true,
        data: emailData,
      });
    }
    
    // 4. Send admin notification email with the screenshot attached
    let adminEmailResult = await resend.emails.send({
      from: fromEmailAdmin,
      to: ["devphoenix@zohomail.in"],
      replyTo: emailAddress,
      subject: `New Payment Submission | DEVPHOENIX Academy`,
      html: adminHtml,
      text: adminText,
      attachments: [
        {
          filename: file.name,
          content: buffer,
        },
      ],
    });
    
    // Fallback: Check if unverified domain error occurred
    const isDomainError = adminEmailResult.error && (
      adminEmailResult.error.message.toLowerCase().includes("not verified") ||
      adminEmailResult.error.message.toLowerCase().includes("verify your domain") ||
      adminEmailResult.error.message.toLowerCase().includes("unverified")
    );

    if (isDomainError) {
      console.warn("⚠️ Domain not verified on Resend. Retrying admin notification using onboarding@resend.dev fallback...");
      const fallbackFromEmailAdmin = getSender("DevPhoeniX Alerts", "onboarding@resend.dev");
      adminEmailResult = await resend.emails.send({
        from: fallbackFromEmailAdmin,
        to: ["devphoenix@zohomail.in"],
        replyTo: emailAddress,
        subject: `[Unverified Sender Fallback] New Payment Submission | DEVPHOENIX Academy`,
        html: adminHtml,
        text: adminText,
        attachments: [
          {
            filename: file.name,
            content: buffer,
          },
        ],
      });
    }

    if (adminEmailResult.error) {
      console.error("❌ Admin Email notification failed:", adminEmailResult.error);
      // We do not fail the request if the email fails, as we have already persisted the lead to MongoDB/cache and uploaded the screenshot.
    }
    
    // 5. Send confirmation auto-reply email to the student
    let studentEmailId: string | undefined;
    try {
      const studentEmailResult = await resend.emails.send({
        from: fromEmailUser,
        to: [emailAddress],
        subject: `Payment Submission Received | DEVPHOENIX Academy`,
        html: studentHtml,
      });
      
      if (studentEmailResult.error) {
        console.error("❌ Student confirmation Email failed to send:", studentEmailResult.error);
      } else {
        studentEmailId = studentEmailResult.data?.id;
      }
    } catch (studentErr) {
      console.error("❌ Student confirmation Email exception:", studentErr);
    }
    
    return apiResponse.success({
      message: "Payment submission received and registered successfully.",
      adminEmailId: adminEmailResult.data?.id,
      studentEmailId,
    });
    
  } catch (error: any) {
    console.error("❌ POST /api/payment-submission Server Error:", error);
    return apiResponse.error(
      error.message || "An error occurred while processing the payment submission",
      "SERVER_ERROR"
    );
  }
}
