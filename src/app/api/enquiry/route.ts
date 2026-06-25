import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { Resend } from "resend";
import { leadsService } from "@/services/mongodb/db.service";
import { hasMongoConfig } from "@/services/mongodb/client";
import { getLocalCacheHelper } from "@/lib/api-utils";
import { Lead } from "@/types";

const cache = getLocalCacheHelper<Lead>("leads.json");


const DEFAULT_FROM_EMAIL = "DevPhoenix Academy <academy@devphoenix.com>";
const DEFAULT_ADMIN_EMAILS = "devphoenix@zohomail.com, devphoenix@zohomail.in, devphoenix04@gmail.com";

function getSender(label: string, fromEnv?: string) {
  const baseEmail = fromEnv || DEFAULT_FROM_EMAIL;
  const emailMatch = baseEmail.match(/<([^>]+)>/) || [null, baseEmail];
  const email = (emailMatch[1] || baseEmail).trim();
  return `${label} <${email}>`;
}

export async function POST(req: Request) {
  try {
    console.log("🚀 /api/enquiry HIT");

    const body = await req.json();
    console.log("📩 Received Body:", body);

    const {
      name,
      email,
      phone,
      college,
      program,
      goal,
      message,
      source,
    } = body;

    // Validation
    if (!name || !email || !phone || !program) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, Email, Phone and Program are required.",
        },
        { status: 400 }
      );
    }

    // Ensure public folder exists
    const publicDir = path.join(
      process.cwd(),
      "public"
    );

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, {
        recursive: true,
      });
    }

    // Excel file path
    const excelFilename = source === "contact" ? "contact_enquiries.xlsx" : "enquiries.xlsx";
    const filePath = path.join(
      publicDir,
      excelFilename
    );

    console.log("📂 Excel Path:", filePath);

    let rows: any[] = [];

    // Read existing Excel
    if (fs.existsSync(filePath)) {
      console.log("📖 Existing Excel found");

      const fileBuffer = fs.readFileSync(filePath);
      const existingWorkbook = XLSX.read(fileBuffer, { type: "buffer" });

      const sheet =
        existingWorkbook.Sheets["Enquiries"];

      if (sheet) {
        rows =
          XLSX.utils.sheet_to_json(sheet);
      }
    }

    // Add new entry
    rows.push({
      Name: name,
      Email: email,
      Phone: phone,
      College: college || "",
      Program: program,
      Goal: goal || "",
      Message: message || "",
      Source: source || "modal",
      Date: new Date().toLocaleString(),
    });

    console.log("📝 Total Rows:", rows.length);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Enquiries"
    );

    // Save Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    fs.writeFileSync(filePath, excelBuffer);

    console.log(
      "✅ Excel saved successfully:",
      filePath
    );

    // Persist to CRM Database
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      email,
      phone,
      program,
      college: college || "",
      current_status: goal || "",
      message: message || "",
      source_page: source || "modal",
      source_campaign: source === "contact" ? "contact_page" : "enquiry_popup",
      status: "New",
      notes: [],
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

    // Send Email
    const apiKey = process.env.RESEND_API_KEY;
    const resend = apiKey ? new Resend(apiKey) : null;

    if (resend) {
      const fromEmail = getSender("DevPhoenix Academy", process.env.RESEND_FROM_EMAIL);
      const adminEmailStr = process.env.RESEND_ADMIN_EMAIL || DEFAULT_ADMIN_EMAILS;
      const adminEmails = adminEmailStr
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      // 1. Send Notification Email to Admin
      try {
        const result =
          await resend.emails.send({
            from: fromEmail,
            to: adminEmails,
            replyTo: email,
            subject: `${name} is interested in ${program}`,
            html: `
              <div style="width: 100%; background-color: #f8fafc; padding: 20px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); box-sizing: border-box;">
                  <h2 style="color: #ff5a1f; margin-top: 0; font-size: 20px; border-bottom: 2px solid #ff5a1f; padding-bottom: 10px;">🎓 New Student Enquiry</h2>
                  <p style="color: #475569; font-size: 14px;">A new student enquiry has been submitted:</p>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; line-height: 1.5;">
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 30%; min-width: 100px; vertical-align: top;">Name:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Email Address:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;"><a href="mailto:${email}" style="color: #ff5a1f; text-decoration: none;">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Phone Number:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;"><a href="tel:${phone}" style="color: #ff5a1f; text-decoration: none;">${phone}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">College / Org:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${college || "Not Provided"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Program:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #ff5a1f; font-weight: bold; vertical-align: top;">${program}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Goal:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${goal || "Not Provided"}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; font-weight: bold; vertical-align: top; color: #64748b; padding-top: 10px;">Message:</td>
                      <td style="padding: 10px 0; color: #0f172a; white-space: pre-line; vertical-align: top; padding-top: 10px;">${message || "No message"}</td>
                    </tr>
                  </table>
                  
                  <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
                  <p style="color: #94a3b8; font-size: 11px; margin: 0; text-align: center;">Submitted on: ${new Date().toLocaleString()}</p>
                </div>
              </div>
            `,
          });

        if (result.error) {
          console.error("❌ Admin Email Send Error from Resend API:", result.error);
        } else {
          console.log("✅ Email sent to admin:", result.data);
        }
      } catch (mailError) {
        console.error(
          "❌ Admin Email Exception:",
          mailError
        );
      }

      // 2. Send Receipt Confirmation Email to Student
      try {
        const studentResult = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `We received your inquiry regarding ${program} - DevPhoeniX Academy`,
          html: `
            <div style="width: 100%; background-color: #f8fafc; padding: 20px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); box-sizing: border-box;">
                <div style="text-align: center; margin-bottom: 25px;">
                  <h2 style="color: #ff5a1f; margin: 0; font-size: 24px; font-weight: 800; tracking-wide: 1px;">DEVPHOENIX ACADEMY</h2>
                  <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: 700;">#FollowTheRise</p>
                </div>
                <p style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Hi ${name},</p>
                <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
                  Thank you for reaching out to DevPhoeniX Academy! We have received your inquiry regarding the <strong>${program}</strong> program.
                </p>
                <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                  Our program advisors and mentors are reviewing your details. A dedicated representative will get in touch with you shortly via phone or email to help clarify any queries and map out your path.
                </p>
                <div style="margin: 25px 0; padding: 20px; background-color: #fff9f5; border: 1px solid rgba(255, 90, 31, 0.1); border-radius: 12px; text-align: center; box-sizing: border-box;">
                  <p style="margin: 0 0 12px 0; font-size: 13px; color: #475569; line-height: 1.4;">
                    Need immediate assistance or want to consult a mentor right now? Connect with us on WhatsApp:
                  </p>
                  <a href="https://wa.me/919734876490?text=Hi%20DevPhoeniX%21%20I%20just%20submitted%20an%20inquiry%20about%20the%20${encodeURIComponent(program)}%20program." style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px;">
                    Chat on WhatsApp
                  </a>
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 15px; line-height: 1.5;">
                  Best regards,<br/>
                  <strong>DevPhoeniX Admissions Team</strong><br/>
                  <a href="mailto:devphoenix@zohomail.in" style="color: #ff5a1f; text-decoration: none; font-weight: 600;">devphoenix@zohomail.in</a>
                </p>
              </div>
            </div>
          `,
        });

        if (studentResult.error) {
          console.error("❌ Student Receipt Email Send Error from Resend API:", studentResult.error);
        } else {
          console.log("✅ Receipt confirmation email sent to student:", studentResult.data);
        }
      } catch (studentMailError) {
        console.error(
          "❌ Student Receipt Email Exception:",
          studentMailError
        );
      }
    } else {
      console.warn(
        "⚠️ RESEND_API_KEY not found"
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Enquiry submitted successfully",
    });
  } catch (error: any) {
    console.error(
      "❌ Enquiry API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}