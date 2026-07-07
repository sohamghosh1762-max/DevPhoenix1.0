interface EmailData {
  fullName: string;
  collegeName: string;
  domainOfInterest: string;
  modeOfPayment: string;
  transactionId: string;
  phoneNumber: string;
  whatsAppNumber: string;
  emailAddress: string;
  dateString: string;
}

export function getAdminEmailHtml(data: EmailData): string {
  return `
    <div style="width: 100%; background-color: #f8fafc; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); box-sizing: border-box;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #ff5a1f; margin: 0; font-size: 22px; font-weight: 800; tracking-wide: 1px;">DEVPHOENIX ACADEMY</h2>
          <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: 700;">Payment Verification System</p>
        </div>
        <h3 style="color: #0f172a; margin-top: 0; font-size: 18px; border-bottom: 2px solid #ff5a1f; padding-bottom: 10px; font-weight: 700;">🔥 New Payment Submission Received</h3>
        <p style="color: #475569; font-size: 14px;">A new student has submitted payment details. Please verify the transaction and activate their enrollment.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 35%; min-width: 120px; vertical-align: top;">Student Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top; font-weight: 600;">${data.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">College:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${data.collegeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Domain of Interest:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #ff5a1f; font-weight: bold; vertical-align: top;">${data.domainOfInterest}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Payment Mode:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${data.modeOfPayment}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Transaction ID:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top; font-family: monospace; font-weight: bold; font-size: 15px; color: #0f172a; letter-spacing: 0.5px;">${data.transactionId}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Phone:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;"><a href="tel:${data.phoneNumber}" style="color: #ff5a1f; text-decoration: none;">${data.phoneNumber}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">WhatsApp:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;"><a href="https://wa.me/${data.whatsAppNumber.replace(/[^0-9]/g, '')}" style="color: #ff5a1f; text-decoration: none;">${data.whatsAppNumber}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;"><a href="mailto:${data.emailAddress}" style="color: #ff5a1f; text-decoration: none;">${data.emailAddress}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Payment Screenshot:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: bold; vertical-align: top;">Attached</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #64748b; vertical-align: top;">Submission Time:</td>
            <td style="padding: 10px 0; color: #0f172a; vertical-align: top;">${data.dateString}</td>
          </tr>
        </table>
      </div>
    </div>
  `;
}

export function getAdminEmailText(data: EmailData): string {
  return `
New Payment Submission Received

Student Details

Name:
${data.fullName}

College:
${data.collegeName}

Domain:
${data.domainOfInterest}

Payment Mode:
${data.modeOfPayment}

Transaction ID:
${data.transactionId}

Phone:
${data.phoneNumber}

WhatsApp:
${data.whatsAppNumber}

Email:
${data.emailAddress}

Payment Screenshot:
Attached

Submission Time:
${data.dateString}
  `.trim();
}

export function getStudentEmailHtml(data: EmailData): string {
  return `
    <div style="width: 100%; background-color: #f8fafc; padding: 30px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); box-sizing: border-box;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #ff5a1f; margin: 0; font-size: 24px; font-weight: 800; tracking-wide: 1px;">DEVPHOENIX ACADEMY</h2>
          <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: 700;">Build Skills. Build Confidence. Build Your Future.</p>
        </div>
        
        <p style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Hello ${data.fullName},</p>
        
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
          Thank you for submitting your payment details to DEVPHOENIX Academy.
        </p>
        
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
          We have successfully received your payment submission and our team will now verify your payment. Once verification is completed, your enrollment will be processed.
        </p>
        
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Meanwhile, you are welcome to join our official WhatsApp Community for updates, announcements, and important information.
        </p>
        
        <div style="margin: 25px 0; padding: 20px; background-color: #fff9f5; border: 1px solid rgba(255, 90, 31, 0.1); border-radius: 12px; text-align: center; box-sizing: border-box;">
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #475569; line-height: 1.4; font-weight: 600;">
            Join the official DEVPHOENIX WhatsApp Community:
          </p>
          <a href="https://chat.whatsapp.com/Gu812Z0hWlD6pinIiL5EI0?mode=gi_t" style="display: inline-block; padding: 12px 24px; background-color: #25d366; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.25);">
            Join WhatsApp Community
          </a>
        </div>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #475569;">
          Please keep your Transaction ID <strong>${data.transactionId}</strong> safe until the verification process is completed.
        </div>
        
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          If any additional information is required, our team will contact you.
        </p>
        
        <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 15px; line-height: 1.5;">
          Regards,<br/>
          <strong>DEVPHOENIX Academy</strong><br/>
          <span style="font-size: 11px; color: #94a3b8;">Build Skills. Build Confidence. Build Your Future.</span>
        </p>
      </div>
    </div>
  `;
}
