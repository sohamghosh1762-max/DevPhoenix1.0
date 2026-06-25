import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

    // Send Email
    if (resend) {
      // 1. Send Notification Email to Admin
      try {
        const result =
          await resend.emails.send({
            from:
              "DevPhoenix Academy <academy@devphoenix.com>",
            to: ["academy@devphoenix.com"],
            subject: `${name} is interested in ${program}`,
            html: `
              <h2>🎓 New Student Enquiry</h2>

              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>College:</strong> ${
                college || "Not Provided"
              }</p>
              <p><strong>Program:</strong> ${program}</p>
              <p><strong>Goal:</strong> ${
                goal || "Not Provided"
              }</p>
              <p><strong>Message:</strong></p>
              <p>${message || "No message"}</p>

              <hr />

              <p>
                Submitted on:
                ${new Date().toLocaleString()}
              </p>
            `,
          });

        console.log(
          "✅ Email sent to admin:",
          result
        );
      } catch (mailError) {
        console.error(
          "❌ Admin Email Error:",
          mailError
        );
      }

      // 2. Send Receipt Confirmation Email to Student
      try {
        const studentResult = await resend.emails.send({
          from: "DevPhoenix Academy <academy@devphoenix.com>",
          to: [email],
          subject: `We received your inquiry regarding ${program} - DevPhoeniX Academy`,
          html: `
            <div style="font-family: sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #ff5a1f; margin: 0; font-size: 24px; font-weight: 800;">DEVPHOENIX ACADEMY</h2>
                <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">#FollowTheRise</p>
              </div>
              <p style="color: #0f172a; font-size: 16px; font-weight: 600;">Hi ${name},</p>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                Thank you for reaching out to DevPhoeniX Academy! We have received your inquiry regarding the <strong>${program}</strong> program.
              </p>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                Our program advisors and mentors are reviewing your details. A dedicated representative will get in touch with you shortly via phone or email to help clarify any queries and map out your path.
              </p>
              <div style="margin: 25px 0; padding: 15px; background-color: #fff9f5; border: 1px solid rgba(255, 90, 31, 0.1); border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #475569;">
                  Need immediate assistance or want to consult a mentor right now? Connect with us on WhatsApp:
                </p>
                <a href="https://wa.me/919734876490?text=Hi%20DevPhoeniX%21%20I%20just%20submitted%20an%20inquiry%20about%20the%20${encodeURIComponent(program)}%20program." style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px;">
                  Chat on WhatsApp
                </a>
              </div>
              <p style="color: #64748b; font-size: 13px; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
                Best regards,<br/>
                <strong>DevPhoeniX Admissions Team</strong><br/>
                <a href="mailto:contact@devphoenix.com" style="color: #ff5a1f; text-decoration: none;">contact@devphoenix.com</a>
              </p>
            </div>
          `,
        });

        console.log(
          "✅ Receipt confirmation email sent to student:",
          studentResult
        );
      } catch (studentMailError) {
        console.error(
          "❌ Student Receipt Email Error:",
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