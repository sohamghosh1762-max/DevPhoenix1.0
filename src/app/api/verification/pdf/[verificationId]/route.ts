import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import qrCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Helper to format dates nicely for the PDF
function formatDate(date: Date | null | undefined): string {
  if (!date) return 'N/A';
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ verificationId: string }> }
) {
  try {
    const { verificationId } = await params;
    const decodedId = decodeURIComponent(verificationId).trim();

    // 1. Fetch verification details from database
    const record = await prisma.verification.findUnique({
      where: { verificationId: decodedId }
    });

    if (!record) {
      return new NextResponse('Verification ID not found', { status: 404 });
    }

    // 2. Create PDF Document
    const pdfDoc = await PDFDocument.create();
    
    // A4 Size: 595.276 x 841.890 points
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();

    // Load fonts
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Color definitions
    const colorPrimary = rgb(0.97, 0.35, 0.12); // Orange Accent (#FF5A1F)
    const colorDark = rgb(0.09, 0.13, 0.22); // Dark Navy / Slate (#172237)
    const colorText = rgb(0.2, 0.27, 0.38); // Body Text slate
    const colorLightGrey = rgb(0.96, 0.96, 0.98); // Light grey (#F5F5FA)
    const colorBorder = rgb(0.88, 0.90, 0.93); // Light border grey

    // A. Draw Outer Border Frame
    page.drawRectangle({
      x: 25,
      y: 25,
      width: width - 50,
      height: height - 50,
      borderColor: colorPrimary,
      borderWidth: 1.5,
      opacity: 0.8
    });
    
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: colorDark,
      borderWidth: 0.5,
      opacity: 0.3
    });

    // B. Embed Logo (if exists) or Draw Vector Logo placeholder
    let logoDrawn = false;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'logo', 'devphoenix-logo.png');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedPng(logoBuffer);
        const logoDims = logoImage.scale(0.35); // scale down logo
        page.drawImage(logoImage, {
          x: 50,
          y: height - 100,
          width: logoDims.width,
          height: logoDims.height
        });
        logoDrawn = true;
      }
    } catch (logoErr) {
      console.error('Failed to embed logo PNG in PDF, drawing vector fallback:', logoErr);
    }

    // Draw Vector Logo if PNG not found/failed
    if (!logoDrawn) {
      // Draw fire icon shape
      page.drawCircle({ x: 70, y: height - 75, size: 18, color: colorPrimary });
      page.drawText('DP', {
        x: 63,
        y: height - 80,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1)
      });
    }

    // Header Corporate Details (Right-aligned)
    page.drawText('DEVPHOENIX TECHNOLOGIES LLP', {
      x: width - 280,
      y: height - 70,
      size: 13,
      font: fontBold,
      color: colorDark
    });
    page.drawText('Academy of Professional Learning & Systems', {
      x: width - 280,
      y: height - 83,
      size: 8,
      font: fontOblique,
      color: colorPrimary
    });
    page.drawText('Web: academy.devphoenix.com | Email: support@devphoenix.com', {
      x: width - 280,
      y: height - 95,
      size: 7.5,
      font: fontRegular,
      color: colorText
    });

    // Horizontal Rule separating header
    page.drawLine({
      start: { x: 50, y: height - 115 },
      end: { x: width - 50, y: height - 115 },
      color: colorBorder,
      thickness: 1
    });

    // C. Document Metadata Info (Ref & Date)
    page.drawText(`Ref: ${record.verificationId}`, {
      x: 50,
      y: height - 140,
      size: 9.5,
      font: fontBold,
      color: colorText
    });

    page.drawText(`Date: ${formatDate(record.issueDate)}`, {
      x: width - 150,
      y: height - 140,
      size: 9.5,
      font: fontBold,
      color: colorText
    });

    // D. Title of the Document
    const titleText = record.documentType.toUpperCase();
    const titleWidth = fontBold.widthOfTextAtSize(titleText, 16);
    
    // Draw background highlight for Title
    page.drawRectangle({
      x: 50,
      y: height - 195,
      width: width - 100,
      height: 32,
      color: colorLightGrey
    });

    page.drawText(titleText, {
      x: (width - titleWidth) / 2,
      y: height - 183,
      size: 16,
      font: fontBold,
      color: colorDark
    });

    // E. Dynamic Body Content Text
    const recipientText = `To, \nMr. / Ms. ${record.studentName.toUpperCase()}\nStudent ID: ${record.studentProfileId.slice(0, 8).toUpperCase()}`;
    page.drawText(recipientText, {
      x: 50,
      y: height - 235,
      size: 10,
      font: fontBold,
      color: colorDark,
      lineHeight: 14
    });

    const isCertificate = record.documentType.toLowerCase().includes('certificate');
    const isExperience = record.documentType.toLowerCase().includes('experience') || record.documentType.toLowerCase().includes('completion');

    let bodyParagraphs: string[] = [];

    if (isCertificate) {
      bodyParagraphs = [
        `This is to certify that ${record.studentName} has successfully completed the "${record.course}" program, specializing under Course Code ${record.courseCode}, conducted by DevPhoenix Academy.`,
        `The program commenced on ${formatDate(record.startDate)} and was completed on ${formatDate(record.endDate)}, spanning a total duration of ${record.duration}. During this program, the candidate was evaluated on regular assignments, attendance checkpoints, and practical capstone milestone submissions.`,
        `The candidate has demonstrated outstanding technical capabilities, core problem-solving aptitude, and successfully integrated the systems engineering concepts taught in our modules. We wish them all the success in their future professional endeavors.`
      ];
    } else if (isExperience) {
      bodyParagraphs = [
        `This is to certify that ${record.studentName} has been engaged with DevPhoenix Technologies LLP for their professional learning and industrial engagement. They successfully completed their tenure for the course ${record.course} (${record.courseCode}) from ${formatDate(record.startDate)} to ${formatDate(record.endDate)}.`,
        `During their tenure of ${record.duration}, their contributions to the codebases, system design blueprints, and collaboration within the teams were highly commendable. Their attention to clean code conventions and systems development lifecycle principles was exemplary.`,
        `Their conduct during this program was professional, and we verify their records are authentic and active under verification index ${record.verificationId}. We wish them success in their future career paths.`
      ];
    } else {
      // Default: Offer Letter (Training / Internship Offer Letter)
      bodyParagraphs = [
        `We are pleased to offer you an appointment as a Trainee for the "${record.course}" industrial program at DevPhoenix Academy. This training program is designed to provide you with practical hands-on experience, core systems architecture knowledge, and direct mentor-led code evaluations.`,
        `Your training is scheduled to begin on ${formatDate(record.startDate)} and will continue until ${formatDate(record.endDate)} for a total duration of ${record.duration}. The program will follow the established curriculum, modules, regular assignments, and final capstone project requirements.`,
        `By accepting this offer, you agree to adhere to the code of conduct, attend all scheduled cohort sessions, and complete the coursework checkpoints on time. We are excited to welcome you to our developer cohort and look forward to building systems together.`
      ];
    }

    let currentY = height - 290;
    bodyParagraphs.forEach((para) => {
      // Simple word wrapping for PDF margins
      const words = para.split(' ');
      let currentLine = '';
      const lines: string[] = [];
      
      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = fontRegular.widthOfTextAtSize(testLine, 10);
        if (width < width - 110) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);

      lines.forEach((line) => {
        page.drawText(line, {
          x: 50,
          y: currentY,
          size: 10,
          font: fontRegular,
          color: colorText
        });
        currentY -= 14;
      });
      currentY -= 10; // paragraph space
    });

    // F. Official Signatures and Seals (Left Footer)
    const footerStartY = 200;

    // 1. Draw Signature Vector
    page.drawText('Issued By:', {
      x: 50,
      y: footerStartY + 60,
      size: 9.5,
      font: fontBold,
      color: colorDark
    });

    // Cursive digital signature drawing (vector paths)
    page.drawSvgPath('M 55 215 C 65 240, 85 200, 95 230 C 110 245, 125 190, 140 220 C 155 230, 145 195, 165 205 M 65 210 L 155 212', {
      borderColor: rgb(0.1, 0.25, 0.75), // Blue ink signature
      borderWidth: 1.5,
      opacity: 0.85
    });

    page.drawText('Vikram Mehta', {
      x: 50,
      y: footerStartY + 15,
      size: 9.5,
      font: fontBold,
      color: colorDark
    });
    page.drawText('Director of Training', {
      x: 50,
      y: footerStartY + 3,
      size: 8,
      font: fontRegular,
      color: colorText
    });
    page.drawText('DevPhoenix Technologies LLP', {
      x: 50,
      y: footerStartY - 9,
      size: 8,
      font: fontRegular,
      color: colorText
    });

    // 2. Draw Company Stamp/Seal
    // Circle 1 (Stamp Outer Ring)
    page.drawCircle({
      x: 230,
      y: footerStartY + 25,
      size: 35,
      borderColor: colorPrimary,
      borderWidth: 1.5,
      opacity: 0.8
    });
    // Circle 2 (Stamp Inner Ring)
    page.drawCircle({
      x: 230,
      y: footerStartY + 25,
      size: 31,
      borderColor: colorPrimary,
      borderWidth: 0.8,
      opacity: 0.6
    });
    // Stamp Internal Text
    page.drawText('DEVPHOENIX', {
      x: 202,
      y: footerStartY + 28,
      size: 8.5,
      font: fontBold,
      color: colorPrimary,
      opacity: 0.85
    });
    page.drawText('TECH LLP', {
      x: 210,
      y: footerStartY + 16,
      size: 8.5,
      font: fontBold,
      color: colorPrimary,
      opacity: 0.85
    });
    page.drawText('SEAL', {
      x: 220,
      y: footerStartY + 4,
      size: 7,
      font: fontBold,
      color: colorPrimary,
      opacity: 0.7
    });

    // G. Verification Box with dynamic QR Code (Right Footer)
    const vBoxWidth = 230;
    const vBoxHeight = 110;
    const vBoxX = width - vBoxWidth - 50;
    const vBoxY = footerStartY - 20;

    // Draw grey background card for verification info
    page.drawRectangle({
      x: vBoxX,
      y: vBoxY,
      width: vBoxWidth,
      height: vBoxHeight,
      color: colorLightGrey,
      borderColor: colorBorder,
      borderWidth: 1
    });

    // Left border indicator in Orange Accent
    page.drawLine({
      start: { x: vBoxX, y: vBoxY },
      end: { x: vBoxX, y: vBoxY + vBoxHeight },
      color: colorPrimary,
      thickness: 3.5
    });

    // Draw text inside the Verification Box
    page.drawText('DOCUMENT VERIFICATION', {
      x: vBoxX + 15,
      y: vBoxY + vBoxHeight - 18,
      size: 8.5,
      font: fontBold,
      color: colorDark
    });

    page.drawText('Scan the QR code to verify the authenticity', {
      x: vBoxX + 15,
      y: vBoxY + vBoxHeight - 30,
      size: 6.5,
      font: fontRegular,
      color: colorText
    });
    page.drawText('of this credential officially.', {
      x: vBoxX + 15,
      y: vBoxY + vBoxHeight - 38,
      size: 6.5,
      font: fontRegular,
      color: colorText
    });

    page.drawText(`ID: ${record.verificationId}`, {
      x: vBoxX + 15,
      y: vBoxY + 35,
      size: 7.5,
      font: fontBold,
      color: colorPrimary
    });

    page.drawText('academy.devphoenix.com/verify', {
      x: vBoxX + 15,
      y: vBoxY + 18,
      size: 7,
      font: fontRegular,
      color: colorText
    });

    // Generate QR Code PNG buffer and embed
    try {
      const origin = req.nextUrl.origin;
      const verifyUrl = `${origin}/verify?id=${record.verificationId}`;

      const qrBuffer = await qrCode.toBuffer(verifyUrl, {
        margin: 1,
        width: 80,
        errorCorrectionLevel: 'M'
      });
      const qrImage = await pdfDoc.embedPng(qrBuffer);

      // Draw QR Code on the right side of the Verification Box
      page.drawImage(qrImage, {
        x: vBoxX + vBoxWidth - 85,
        y: vBoxY + 15,
        width: 75,
        height: 75
      });
    } catch (qrErr) {
      console.error('Failed to generate and draw QR code on PDF:', qrErr);
    }

    // Save PDF and write response headers
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${record.verificationId}.pdf"`,
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    });
  } catch (error: any) {
    console.error('Dynamic PDF Generation Route Error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
