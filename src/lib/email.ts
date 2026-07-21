import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resendKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendKey || 're_dummykeyforbuildtypecheck');

const DEFAULT_FROM = 'DevPhoenix Academy <academy@devphoenix.com>';
const ADMIN_EMAIL = 'devphoenix@zohomail.in';

function getSender(label: string) {
  const baseEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const emailMatch = baseEmail.match(/<([^>]+)>/) || [null, baseEmail];
  const email = (emailMatch[1] || baseEmail).trim();
  return `${label} <${email}>`;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
  replyTo
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
  replyTo?: string;
}) {
  const recipientList = Array.isArray(to) ? to : [to];
  const useSMTP = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

  if (useSMTP) {
    try {
      console.log(`[Email Dispatch] Sending via SMTP to: ${recipientList.join(', ')}`);
      const host = process.env.SMTP_HOST || 'smtp.zoho.in';
      const port = parseInt(process.env.SMTP_PORT || '465', 10);
      const secure = process.env.SMTP_SECURE !== 'false';
      
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const fromLabel = 'DevPhoenix Academy';
      const smtpFrom = `"${fromLabel}" <${process.env.SMTP_USER}>`;

      const mailOptions = {
        from: smtpFrom,
        to: recipientList.join(', '),
        replyTo: replyTo || process.env.SMTP_USER,
        subject,
        html,
        text: text || '',
        attachments: attachments || [],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent via SMTP successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ SMTP email dispatch failed:', error);
      return { success: false, error };
    }
  }

  // Fallback to Resend
  if (!resendKey || resendKey === 're_placeholder') {
    console.log(`[Email Simulation] To: ${recipientList.join(', ')} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }

  try {
    const from = getSender('DevPhoenix Academy');
    const resendAttachments = attachments?.map(att => ({
      filename: att.filename,
      content: att.content,
    }));

    let response = await resend.emails.send({
      from,
      to: recipientList,
      replyTo,
      subject,
      html,
      text: text || '',
      attachments: resendAttachments,
    });

    const isDomainError = response.error && (
      response.error.message.toLowerCase().includes("not verified") ||
      response.error.message.toLowerCase().includes("verify your domain") ||
      response.error.message.toLowerCase().includes("unverified")
    );

    if (isDomainError) {
      console.warn("⚠️ Domain not verified on Resend. Retrying using onboarding@resend.dev fallback...");
      const fallbackFrom = `DevPhoenix Academy <onboarding@resend.dev>`;
      response = await resend.emails.send({
        from: fallbackFrom,
        to: recipientList,
        replyTo,
        subject: `[Fallback] ${subject}`,
        html,
        text: text || '',
        attachments: resendAttachments,
      });
    }

    const isSandboxError = response.error && (
      response.error.message.includes("You can only send testing emails to your own email address")
    );

    if (isSandboxError && response.error) {
      const match = response.error.message.match(/to your own email address \(([^)]+)\)/);
      const ownerEmail = match ? match[1] : null;
      if (ownerEmail && !recipientList.includes(ownerEmail)) {
        console.warn(`⚠️ Resend is in Sandbox mode. Redirecting email from unverified recipients to account owner: ${ownerEmail}`);
        response = await resend.emails.send({
          from: `DevPhoenix Academy <onboarding@resend.dev>`,
          to: [ownerEmail],
          replyTo,
          subject: `[Sandbox Redirect] ${subject}`,
          html,
          text: text || '',
          attachments: resendAttachments,
        });
      }
    }

    if (response.error) {
      console.error('Resend email error:', response.error);
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Resend email dispatch failed:', error);
    return { success: false, error };
  }
}

// 1. Student Registration Confirmation
export async function sendRegistrationConfirmation(studentEmail: string, studentName: string, studentCode: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ff5a1f; border-radius: 8px;">
      <h2 style="color: #ff5a1f;">Welcome to DevPhoenix Academy!</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Your registration for the industrial training program is successful.</p>
      <p>Your login credentials are as follows:</p>
      <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <p style="margin: 5px 0;"><strong>Student Code:</strong> ${studentCode}</p>
        <p style="margin: 5px 0;"><strong>Access URL:</strong> <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
      </div>
      <p>Please log in using your student code and the password you registered with.</p>
      <p>Best regards,<br/>DevPhoenix Academy Team</p>
    </div>
  `;
  return sendEmail({
    to: studentEmail,
    subject: 'DevPhoenix Academy - Trainee Registration Completed',
    html,
  });
}

// 2. Student Registration Admin Alert
export async function sendAdminRegistrationAlert(studentName: string, studentCode: string, studentEmail: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #64748b; border-radius: 8px;">
      <h2 style="color: #0f172a;">New Student Registered</h2>
      <p>A new trainee has registered successfully on the platform.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Name:</td><td>${studentName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Student Code:</td><td>${studentCode}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${studentEmail}</td></tr>
      </table>
    </div>
  `;
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Admin Alert] New Student Registration - ${studentCode}`,
    html,
  });
}

// 3. Student Payment Submission Confirmation
export async function sendPaymentSubmissionConfirmation(studentEmail: string, studentName: string, transactionId: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ff5a1f; border-radius: 8px;">
      <h2 style="color: #ff5a1f;">Payment Submission Received</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>We have received your payment transaction details. Our verification committee is currently checking the details.</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p>We will update your enrollment status once the transaction is verified (typically within 12-24 hours).</p>
      <p>Best regards,<br/>DevPhoenix Academy Verification Team</p>
    </div>
  `;
  return sendEmail({
    to: studentEmail,
    subject: 'DevPhoenix Academy - Payment Submission Received',
    html,
  });
}

// 4. Admin Payment Alert
export async function sendAdminPaymentAlert(studentName: string, studentCode: string, transactionId: string, amount: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ff5a1f; border-radius: 8px;">
      <h2 style="color: #ff5a1f;">New Payment Submission</h2>
      <p>A trainee has submitted a new payment verification request.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Trainee:</td><td>${studentName} (${studentCode})</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Amount:</td><td>${amount}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Transaction ID:</td><td>${transactionId}</td></tr>
      </table>
      <p>Please log in to the admin panel to verify the payment and screenshot.</p>
    </div>
  `;
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Admin Alert] New Payment Verification Request - ${studentCode}`,
    html,
  });
}

// 5. Payment Approved
export async function sendPaymentApproved(studentEmail: string, studentName: string, programTitle: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #10b981; border-radius: 8px;">
      <h2 style="color: #10b981;">Payment Verified Successfully</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Congratulations! Your payment has been verified by our admissions board.</p>
      <p>Your enrollment in <strong>${programTitle}</strong> is now active. Please log in to your dashboard to access the courses and start learning.</p>
      <p>Best regards,<br/>Admissions Board, DevPhoenix Academy</p>
    </div>
  `;
  return sendEmail({
    to: studentEmail,
    subject: 'DevPhoenix Academy - Enrollment Activated',
    html,
  });
}

// 6. Payment Rejected
export async function sendPaymentRejected(studentEmail: string, studentName: string, reason?: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ef4444; border-radius: 8px;">
      <h2 style="color: #ef4444;">Payment Verification Failed</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>We were unable to verify your payment submission. It has been rejected by our verification board.</p>
      ${reason ? `<p><strong>Reason for Rejection:</strong> ${reason}</p>` : ''}
      <p>Please double-check your transaction details and screenshot and re-submit your payment request in the dashboard, or reply to this email for support.</p>
      <p>Best regards,<br/>Admissions Board, DevPhoenix Academy</p>
    </div>
  `;
  return sendEmail({
    to: studentEmail,
    subject: 'DevPhoenix Academy - Payment Verification Failed',
    html,
  });
}

// 7. Certificate Issued
export async function sendCertificateIssued(studentEmail: string, studentName: string, programTitle: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ff5a1f; border-radius: 8px;">
      <h2 style="color: #ff5a1f;">Certificate Issued!</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Congratulations on completing the <strong>${programTitle}</strong> program!</p>
      <p>Your official Certificate of Completion has been issued. You can view, share, or download it from your Student Portal dashboard under the certificates tab.</p>
      <p>Keep up the great work!</p>
      <p>Regards,<br/>DevPhoenix Board of Trustees</p>
    </div>
  `;
  return sendEmail({
    to: studentEmail,
    subject: `Certificate of Completion Issued - ${programTitle}`,
    html,
  });
}

// 8. Password Reset
export async function sendPasswordResetEmail(studentEmail: string, studentName: string, resetLink: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ff5a1f; border-radius: 8px;">
      <h2 style="color: #ff5a1f;">Password Reset Request</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p><a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #ff5a1f; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Regards,<br/>DevPhoenix Security Team</p>
    </div>
  `;
  return sendEmail({
    to: studentEmail,
    subject: 'DevPhoenix Academy - Password Reset Link',
    html,
  });
}

// 9. Support Request Admin Alert
export async function sendAdminSupportAlert(studentName: string, studentCode: string, studentEmail: string, message: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ff5a1f; border-radius: 8px;">
      <h2 style="color: #ff5a1f;">New Support Request</h2>
      <p>A trainee has submitted a support message via their portal.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr><td style="padding: 6px 0; font-weight: bold; width: 30%;">Trainee:</td><td>${studentName} (${studentCode})</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${studentEmail}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Message:</td><td>${message}</td></tr>
      </table>
    </div>
  `;
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Support Request] ${studentCode} - ${studentName}`,
    html,
  });
}
