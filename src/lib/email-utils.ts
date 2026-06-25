import { Resend } from 'resend';

const DEFAULT_FROM_EMAIL = "DevPhoenix Academy <academy@devphoenix.com>";
const DEFAULT_ADMIN_EMAILS = "devphoenix@zohomail.com, devphoenix@zohomail.in, devphoenix04@gmail.com";

function getSender(label: string, fromEnv?: string) {
  const baseEmail = fromEnv || DEFAULT_FROM_EMAIL;
  const emailMatch = baseEmail.match(/<([^>]+)>/) || [null, baseEmail];
  const email = (emailMatch[1] || baseEmail).trim();
  return `${label} <${email}>`;
}

export async function sendLeadEmail(lead: any) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmailEnv = process.env.RESEND_ADMIN_EMAIL || DEFAULT_ADMIN_EMAILS;
  const adminEmails = adminEmailEnv.split(',').map(e => e.trim()).filter(Boolean);
  const timestamp = new Date().toLocaleString();

  console.log(`[Email Dispatch] Triggering Resend notification/auto-reply for lead: ${lead.name}`);

  // Formulate Admin Notification details
  const adminSubject = `New Website Lead - ${lead.program || 'General Inquiry'}`;
  const adminText = `
New Lead Submission Details:
----------------------------
Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
College/Organization: ${lead.college || 'N/A'}
Program: ${lead.program || 'General Inquiry'}
Message: ${lead.message || 'None'}
Source Page: ${lead.source_page || 'Unknown'}
Timestamp: ${timestamp}
  `;
  const adminHtml = `
    <div style="width: 100%; background-color: #f8fafc; padding: 20px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); box-sizing: border-box;">
        <h2 style="color: #ff5a1f; margin-top: 0; font-size: 20px; border-bottom: 2px solid #ff5a1f; padding-bottom: 10px;">🔥 New Website Lead</h2>
        <p style="color: #475569; font-size: 14px;">A new lead has been captured from the DevPhoeniX website:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; line-height: 1.5;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 30%; min-width: 100px; vertical-align: top;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Email Address:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;"><a href="mailto:${lead.email}" style="color: #ff5a1f; text-decoration: none;">${lead.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Phone Number:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;"><a href="tel:${lead.phone}" style="color: #ff5a1f; text-decoration: none;">${lead.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">College / Org:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${lead.college || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Program:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #ff5a1f; font-weight: bold; vertical-align: top;">${lead.program || 'General Inquiry'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Source Page:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${lead.source_page || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; color: #64748b; vertical-align: top;">Timestamp:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; vertical-align: top;">${timestamp}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; vertical-align: top; color: #64748b; padding-top: 10px;">Message:</td>
            <td style="padding: 10px 0; color: #0f172a; white-space: pre-line; vertical-align: top; padding-top: 10px;">${lead.message || 'N/A'}</td>
          </tr>
        </table>
      </div>
    </div>
  `;

  // Formulate Auto Reply details
  const autoReplySubject = `Thank You for Contacting DEVPHOENIX`;
  const autoReplyHtml = `
    <div style="width: 100%; background-color: #f8fafc; padding: 20px 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); box-sizing: border-box;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #ff5a1f; margin: 0; font-size: 24px; font-weight: 800; tracking-wide: 1px;">DEVPHOENIX</h2>
          <p style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: 700;">#FollowTheRise</p>
        </div>
        <p style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Hi ${lead.name},</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
          Thank you for contacting DEVPHOENIX! We have received your inquiry regarding our <strong>${lead.program || 'Industrial Training Programs'}</strong>.
        </p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
          Our admissions committee and program advisors are reviewing your details. A dedicated mentor will reach out to you shortly via phone or email to help plan your personalized learning path.
        </p>
        <div style="margin: 25px 0; padding: 20px; background-color: #fff9f5; border: 1px solid rgba(255, 90, 31, 0.1); border-radius: 12px; text-align: center; box-sizing: border-box;">
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #475569; line-height: 1.4;">
            Need to speak with us immediately? Connect with us on WhatsApp:
          </p>
          <a href="https://wa.me/919734876490" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px;">
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
  `;

  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY environment variable not set. Running email dispatch in simulated mode.');
    console.log(`
--- SIMULATED ADMIN NOTIFICATION EMAIL ---
From: ${getSender('DevPhoeniX Alerts', process.env.RESEND_FROM_EMAIL)}
To: ${adminEmails.join(', ')}
Subject: ${adminSubject}
Content:
${adminText}
------------------------------------------

--- SIMULATED USER AUTO-REPLY EMAIL ---
From: ${getSender('DEVPHOENIX Team', process.env.RESEND_FROM_EMAIL)}
To: ${lead.email}
Subject: ${autoReplySubject}
---------------------------------------
    `);
    return { success: true, simulated: true };
  }

  try {
    const resendClient = new Resend(apiKey);
    const fromEmailAdmin = getSender('DevPhoeniX Alerts', process.env.RESEND_FROM_EMAIL);
    const fromEmailUser = getSender('DEVPHOENIX Team', process.env.RESEND_FROM_EMAIL);

    // 1. Send notification to admin
    const adminResponse = await resendClient.emails.send({
      from: fromEmailAdmin,
      to: adminEmails,
      subject: adminSubject,
      html: adminHtml,
    });

    if (adminResponse.error) {
      console.error('❌ [Email Dispatch] Admin notification failed:', adminResponse.error);
    } else {
      console.log(`[Email Dispatch] Admin notification queued:`, adminResponse.data);
    }

    // 2. Send confirmation to user
    const userResponse = await resendClient.emails.send({
      from: fromEmailUser,
      to: lead.email,
      subject: autoReplySubject,
      html: autoReplyHtml,
    });

    if (userResponse.error) {
      console.error('❌ [Email Dispatch] User confirmation failed:', userResponse.error);
    } else {
      console.log(`[Email Dispatch] User confirmation queued:`, userResponse.data);
    }

    return {
      success: !adminResponse.error && !userResponse.error,
      adminEmailId: adminResponse.data?.id,
      userEmailId: userResponse.data?.id,
      error: adminResponse.error || userResponse.error
    };
  } catch (error) {
    console.error('❌ [Email Dispatch] Resend API error:', error);
    // Graceful error return so database write and success responses succeed
    return { success: false, error };
  }
}
