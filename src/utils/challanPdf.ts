import jsPDF from 'jspdf';
import { Order, StoreSettings } from '../types';
import { toBengaliNumber, formatTaka, formatBengaliDate } from './bengaliUtils';

// Helper to load image as base64 or HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // In case of error, resolve with placeholder or proceed
      resolve(img);
    };
    img.src = src;
  });
}

export async function generateBanglaChallanPdf(order: Order, settings: StoreSettings): Promise<void> {
  // Create high-resolution canvas for A4 page (210 x 297 mm at 150 DPI = 1240 x 1754 px)
  const width = 1240;
  const height = 1754;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context could not be created');
  }

  // Ensure Bengali fonts are loaded
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Load founder photo
  let founderImg: HTMLImageElement | null = null;
  try {
    founderImg = await loadImage(settings.founderPhoto || '/assets/aistudio/01_31f695e4.png');
  } catch (e) {
    console.warn('Could not load founder photo for PDF:', e);
  }

  // 1. White Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = '#065F46'; // emerald-800
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  ctx.strokeStyle = '#D97706'; // amber-600 gold accent
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Header background banner
  ctx.fillStyle = '#F0FDF4'; // soft emerald
  ctx.fillRect(40, 40, width - 80, 200);

  // Draw founder photo in top-left
  const photoX = 60;
  const photoY = 60;
  const photoW = 120;
  const photoH = 150;

  ctx.save();
  // Rounded rect or photo border
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(photoX, photoY, photoW, photoH);
  if (founderImg && founderImg.naturalWidth > 0) {
    try {
      ctx.drawImage(founderImg, photoX, photoY, photoW, photoH);
    } catch {
      // fallback
    }
  }
  ctx.strokeStyle = '#065F46';
  ctx.lineWidth = 3;
  ctx.strokeRect(photoX, photoY, photoW, photoH);
  ctx.restore();

  // Founder Information (Beside photo)
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 22px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(settings.founderName, photoX + photoW + 25, 95);

  ctx.fillStyle = '#065F46';
  ctx.font = '600 17px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(settings.founderTitle, photoX + photoW + 25, 125);

  ctx.fillStyle = '#1F2937';
  ctx.font = '600 18px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`মোবাইল: ${settings.founderPhone}`, photoX + photoW + 25, 155);

  ctx.fillStyle = '#4B5563';
  ctx.font = '15px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`ঠিকানা: ${settings.officeAddress}`, photoX + photoW + 25, 185);

  // Brand Name on right side
  ctx.textAlign = 'right';
  ctx.fillStyle = '#065F46';
  ctx.font = 'bold 36px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(settings.storeName, width - 60, 95);

  ctx.fillStyle = '#B45309';
  ctx.font = 'bold 18px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('নির্মাণ সামগ্রী বিক্রয় কেন্দ্র ও সরবরাহকারী', width - 60, 130);

  ctx.fillStyle = '#374151';
  ctx.font = '15px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`হটলাইন: ${settings.helpline}`, width - 60, 160);

  ctx.textAlign = 'left';

  // Digital Challan Title Badge
  const titleBoxY = 265;
  ctx.fillStyle = '#065F46';
  ctx.fillRect(width / 2 - 200, titleBoxY, 400, 48);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ডিজিটাল সরবরাহ চালান ও রসিদ', width / 2, titleBoxY + 33);
  ctx.textAlign = 'left';

  // Order meta box (2 columns)
  const metaY = 345;
  ctx.fillStyle = '#F9FAFB';
  ctx.fillRect(60, metaY, width - 120, 160);
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, metaY, width - 120, 160);

  // Left column: Order info
  ctx.fillStyle = '#065F46';
  ctx.font = 'bold 18px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('চালানের বিবরণ:', 80, metaY + 35);

  ctx.fillStyle = '#1F2937';
  ctx.font = '16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`চালান নং: ${order.orderNumber}`, 80, metaY + 68);
  ctx.fillText(`অর্ডারের তারিখ: ${formatBengaliDate(order.createdAt)}`, 80, metaY + 100);
  ctx.fillText(`পেমেন্ট মাধ্যম: ${order.paymentMethod === 'Cash on Delivery' ? 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে পরিশোধ)' : order.paymentMethod}`, 80, metaY + 132);

  // Right column: Customer info
  const rightColX = width / 2 + 30;
  ctx.fillStyle = '#065F46';
  ctx.font = 'bold 18px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('গ্রাহক ও ডেলিভারির বিবরণ:', rightColX, metaY + 35);

  ctx.fillStyle = '#1F2937';
  ctx.font = '16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`গ্রাহকের নাম: ${order.customerName}`, rightColX, metaY + 68);
  ctx.fillText(`মোবাইল নম্বর: ${toBengaliNumber(order.customerPhone)}`, rightColX, metaY + 100);
  ctx.fillText(`ঠিকানা: ${order.villageArea ? order.villageArea + ', ' : ''}${order.upazila}, ${order.district}`, rightColX, metaY + 132);

  // Detailed address if present
  ctx.fillStyle = '#4B5563';
  ctx.font = '14px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  if (order.detailedAddress) {
    ctx.fillText(`বিস্তারিত ঠিকানা: ${order.detailedAddress}`, 80, metaY + 185);
  }

  // Table of Products
  const tableY = 540;
  const colWidths = [80, 480, 180, 180, 200]; // total 1120 px
  const colX = [
    60,
    60 + colWidths[0],
    60 + colWidths[0] + colWidths[1],
    60 + colWidths[0] + colWidths[1] + colWidths[2],
    60 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]
  ];

  // Table Header
  ctx.fillStyle = '#065F46';
  ctx.fillRect(60, tableY, width - 120, 45);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 17px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('নং', colX[0] + 25, tableY + 30);
  ctx.fillText('পণ্যের বিবরণ ও ক্যাটাগরি', colX[1] + 20, tableY + 30);
  ctx.fillText('পরিমাণ ও একক', colX[2] + 20, tableY + 30);
  ctx.fillText('একক মূল্য', colX[3] + 20, tableY + 30);
  ctx.fillText('মোট মূল্য', colX[4] + 20, tableY + 30);

  // Table Rows
  let curY = tableY + 45;
  order.items.forEach((item, idx) => {
    ctx.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
    ctx.fillRect(60, curY, width - 120, 50);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, curY, width - 120, 50);

    ctx.fillStyle = '#111827';
    ctx.font = '16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillText(toBengaliNumber(idx + 1), colX[0] + 25, curY + 32);

    ctx.font = 'bold 16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`${item.productName} (${item.category})`, colX[1] + 20, curY + 32);

    ctx.font = '16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillText(`${toBengaliNumber(item.quantity)} ${item.unit}`, colX[2] + 20, curY + 32);
    ctx.fillText(formatTaka(item.unitPrice), colX[3] + 20, curY + 32);

    ctx.font = 'bold 16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
    ctx.fillStyle = '#065F46';
    ctx.fillText(formatTaka(item.lineTotal), colX[4] + 20, curY + 32);

    curY += 50;
  });

  // Summary Totals Box on Right
  const summaryBoxY = curY + 20;
  const summaryW = 420;
  const summaryX = width - 60 - summaryW;

  ctx.fillStyle = '#F3F4F6';
  ctx.fillRect(summaryX, summaryBoxY, summaryW, 145);
  ctx.strokeStyle = '#D1D5DB';
  ctx.strokeRect(summaryX, summaryBoxY, summaryW, 145);

  ctx.fillStyle = '#374151';
  ctx.font = '17px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('পণ্য উপ-মোট:', summaryX + 25, summaryBoxY + 35);
  ctx.textAlign = 'right';
  ctx.fillText(formatTaka(order.subtotal), summaryX + summaryW - 25, summaryBoxY + 35);

  ctx.textAlign = 'left';
  ctx.fillText('পরিবহন/ডেলিভারি চার্জ:', summaryX + 25, summaryBoxY + 70);
  ctx.textAlign = 'right';
  ctx.fillText(formatTaka(order.deliveryCharge), summaryX + summaryW - 25, summaryBoxY + 70);

  // Grand Total highlight bar
  ctx.fillStyle = '#065F46';
  ctx.fillRect(summaryX, summaryBoxY + 90, summaryW, 55);

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.font = 'bold 20px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('সর্বমোট প্রদেয়:', summaryX + 25, summaryBoxY + 126);

  ctx.textAlign = 'right';
  ctx.font = 'bold 22px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(formatTaka(order.grandTotal), summaryX + summaryW - 25, summaryBoxY + 126);

  ctx.textAlign = 'left';

  // Notes & terms box on left
  const notesW = summaryX - 80;
  ctx.fillStyle = '#FEF3C7';
  ctx.fillRect(60, summaryBoxY, notesW, 145);
  ctx.strokeStyle = '#FCD34D';
  ctx.strokeRect(60, summaryBoxY, notesW, 145);

  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('গুরুত্বপূর্ণ নির্দেশনাবলী:', 80, summaryBoxY + 32);

  ctx.fillStyle = '#78350F';
  ctx.font = '14px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText('১. পণ্য আনলোড করার পূর্বে চালান কপি ও পণ্যের গুণগত মান যাচাই করুন।', 80, summaryBoxY + 62);
  ctx.fillText('২. কোনো ভাঙাচোরা বা সমস্যা পরিলক্ষিত হলে ডেলিভারিম্যানকে তাৎক্ষণিক জানান।', 80, summaryBoxY + 90);
  if (order.customerNotes) {
    ctx.fillText(`গ্রাহকের নোট: ${order.customerNotes}`, 80, summaryBoxY + 120);
  } else {
    ctx.fillText('৩. HBC PANARPUL থেকে ক্রয় করার জন্য ধন্যবাদ।', 80, summaryBoxY + 120);
  }

  // Order Status Stamp / Watermark
  ctx.save();
  ctx.translate(width / 2, curY + 230);
  ctx.rotate(-0.08);
  ctx.fillStyle = 'rgba(6, 95, 70, 0.08)';
  ctx.font = 'bold 50px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HBC PANARPUL — OFFICIAL CHALLAN', 0, 0);
  ctx.restore();

  // Signature Block at Bottom
  const signY = height - 160;

  // Left: Customer receiver sign
  ctx.strokeStyle = '#6B7280';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, signY);
  ctx.lineTo(360, signY);
  ctx.stroke();

  ctx.fillStyle = '#374151';
  ctx.font = '16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('পণ্য গ্রহণকারীর স্বাক্ষর ও তারিখ', 230, signY + 30);

  // Right: Founder / Authorized Sign
  ctx.beginPath();
  ctx.moveTo(width - 360, signY);
  ctx.lineTo(width - 100, signY);
  ctx.stroke();

  ctx.fillStyle = '#065F46';
  ctx.font = 'bold 16px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillText(`${settings.founderName}`, width - 230, signY + 28);
  ctx.font = '14px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.fillStyle = '#4B5563';
  ctx.fillText('অনুমোদিত স্বাক্ষরকারী, HBC PANARPUL', width - 230, signY + 48);

  ctx.textAlign = 'left';

  // Bottom Notice
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '13px "Hind Siliguri", "Noto Sans Bengali", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('এটি একটি কম্পিউটার জেনারেটেড ডিজিটাল সরবরাহ চালান। যে কোনো অনুসন্ধানে কল করুন: ' + settings.founderPhone, width / 2, height - 45);

  // Export to jsPDF A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const imgData = canvas.toDataURL('image/png', 0.95);
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

  const filename = `Challan-${order.orderNumber}.pdf`;
  pdf.save(filename);
}
