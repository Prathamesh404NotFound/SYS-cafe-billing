import QRCode from 'qrcode';

export interface UpiParams {
  upiId: string;
  payeeName?: string;
  amount?: number;
  billNumber?: string;
  note?: string;
}

/**
 * Generate standard NPCI UPI payment URI
 * Format: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
 */
export function generateUpiUri(params: UpiParams): string {
  const { upiId, payeeName = 'SYS Cafe', amount, billNumber, note } = params;
  const cleanUpi = upiId.trim();
  const cleanPayee = encodeURIComponent(payeeName.trim());
  const txNote = encodeURIComponent(note || (billNumber ? `Bill-${billNumber}` : 'SYS Cafe Order'));

  let uri = `upi://pay?pa=${cleanUpi}&pn=${cleanPayee}&cu=INR&tn=${txNote}`;
  if (amount && amount > 0) {
    uri += `&am=${amount.toFixed(2)}`;
  }
  return uri;
}

/**
 * Generate QR code as Base64 Data URL (PNG)
 */
export async function generateQrDataUrl(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    color?: { dark?: string; light?: string };
  }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 320,
      margin: options?.margin !== undefined ? options?.margin : 2,
      color: {
        dark: options?.color?.dark || '#111827',
        light: options?.color?.light || '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (error) {
    console.error('Failed to generate QR code data URL:', error);
    throw error;
  }
}

/**
 * Generate Table Digital Menu & Ordering URL
 */
export function generateTableUrl(tableNumber: number | string): string {
  if (typeof window === 'undefined') return `?table=${tableNumber}`;
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?table=${tableNumber}`;
}

/**
 * Download QR data URL as an image file
 */
export function downloadQrDataUrl(dataUrl: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
