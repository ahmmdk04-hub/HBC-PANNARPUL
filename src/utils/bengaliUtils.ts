const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '০';
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function formatTaka(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null) return '৳০';
  const numericVal = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  // Format with commas like Indian/South Asian grouping: 15,000
  const formattedEn = numericVal.toLocaleString('en-IN');
  return `৳${toBengaliNumber(formattedEn)}`;
}

export function formatBengaliDate(isoOrDateString?: string): string {
  if (!isoOrDateString) return '';
  try {
    const d = new Date(isoOrDateString);
    if (isNaN(d.getTime())) return isoOrDateString;
    
    const day = toBengaliNumber(d.getDate().toString().padStart(2, '0'));
    const monthNamesBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const month = monthNamesBn[d.getMonth()];
    const year = toBengaliNumber(d.getFullYear());
    
    let hours = d.getHours();
    const minutes = toBengaliNumber(d.getMinutes().toString().padStart(2, '0'));
    const ampm = hours >= 12 ? 'বিকাল/রাত' : 'সকাল';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    const hoursBn = toBengaliNumber(hours);

    return `${day} ${month}, ${year} (${hoursBn}:${minutes} ${ampm})`;
  } catch {
    return isoOrDateString;
  }
}

export function isValidBdPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\+]/g, '');
  // Valid formats: 01711141576 or 8801711141576
  const regex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return regex.test(cleaned);
}

export function generateSequentialOrderNumber(existingOrders: { orderNumber?: string }[] = []): string {
  const prefix = 'HBC-2026-';
  let maxSeq = 0;

  for (const order of existingOrders) {
    if (order.orderNumber && order.orderNumber.startsWith(prefix)) {
      const numPart = order.orderNumber.slice(prefix.length);
      const parsed = parseInt(numPart, 10);
      if (!isNaN(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  const padded = nextSeq.toString().padStart(2, '0');
  return `${prefix}${padded}`;
}

export function generateOrderNumber(existingOrders: { orderNumber?: string }[] = []): string {
  return generateSequentialOrderNumber(existingOrders);
}

