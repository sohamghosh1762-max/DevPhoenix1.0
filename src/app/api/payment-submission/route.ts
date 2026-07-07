import { NextRequest } from "next/server";
import { paymentSubmissionSchema } from "@/lib/validation";
import { resend } from "@/lib/resend";
import { getAdminEmailHtml, getAdminEmailText, getStudentEmailHtml } from "@/lib/emailTemplates";
import { apiResponse } from "@/lib/api-utils";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/validation";

export const dynamic = "force-dynamic";

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
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ RESEND_API_KEY is not configured. Running email dispatch in simulated mode.");
      console.log(`
--- SIMULATED ADMIN PAYMENT EMAIL ---
From: ${fromEmailAdmin}
To: devphoenix@zoho.in
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
        message: "Payment submission received (Simulated email transmission).",
        simulated: true,
        data: emailData,
      });
    }
    
    // 4. Send admin notification email with the screenshot attached
    const adminEmailResult = await resend.emails.send({
      from: fromEmailAdmin,
      to: ["devphoenix@zoho.in"],
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
    
    if (adminEmailResult.error) {
      console.error("❌ Admin Email notification failed:", adminEmailResult.error);
      return apiResponse.error(
        adminEmailResult.error.message || "Failed to notify admin via email",
        "ADMIN_EMAIL_FAILED",
        adminEmailResult.error
      );
    }
    
    // 5. Send confirmation auto-reply email to the student
    const studentEmailResult = await resend.emails.send({
      from: fromEmailUser,
      to: [emailAddress],
      subject: `Payment Submission Received | DEVPHOENIX Academy`,
      html: studentHtml,
    });
    
    if (studentEmailResult.error) {
      console.error("❌ Student confirmation Email failed to send:", studentEmailResult.error);
    }
    
    return apiResponse.success({
      message: "Payment submission received and emails dispatched successfully.",
      adminEmailId: adminEmailResult.data?.id,
      studentEmailId: studentEmailResult.data?.id,
    });
    
  } catch (error: any) {
    console.error("❌ POST /api/payment-submission Server Error:", error);
    return apiResponse.error(
      error.message || "An error occurred while processing the payment submission",
      "SERVER_ERROR"
    );
  }
}
