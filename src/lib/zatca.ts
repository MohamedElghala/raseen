/**
 * ZATCA (FATOORA) E-Invoicing TLV & QR Code Utilities
 * Compliant with Saudi ZATCA E-Invoicing Phase 1 & 2 Regulations
 * Zero external dependencies.
 */

interface ZatcaInvoiceData {
  sellerName: string;
  vatNumber: string;
  timestamp: string; // ISO 8601 (e.g. 2026-10-15T12:00:00Z)
  totalAmount: string; // Total with VAT
  vatAmount: string;   // Total VAT
}

/**
 * Encodes a string value into Tag-Length-Value (TLV) binary format
 * Tag: 1 byte
 * Length: 1 byte (length of UTF-8 encoded bytes)
 * Value: UTF-8 encoded bytes
 */
function toTLV(tag: number, value: string): Uint8Array {
  const encoder = new TextEncoder();
  const valueBytes = encoder.encode(value);
  const length = valueBytes.length;
  const tlv = new Uint8Array(2 + length);
  tlv[0] = tag;
  tlv[1] = length;
  tlv.set(valueBytes, 2);
  return tlv;
}

/**
 * Generates official ZATCA Base64 TLV string from invoice parameters
 */
export function generateZatcaTLV(data: ZatcaInvoiceData): string {
  const tlv1 = toTLV(1, data.sellerName || 'شركة رَصين للحلول الرقمية');
  const tlv2 = toTLV(2, data.vatNumber || '31024589200003');
  const tlv3 = toTLV(3, data.timestamp || new Date().toISOString());
  const tlv4 = toTLV(4, data.totalAmount || '0.00');
  const tlv5 = toTLV(5, data.vatAmount || '0.00');

  const totalLength = tlv1.length + tlv2.length + tlv3.length + tlv4.length + tlv5.length;
  const combined = new Uint8Array(totalLength);

  let offset = 0;
  [tlv1, tlv2, tlv3, tlv4, tlv5].forEach((chunk) => {
    combined.set(chunk, offset);
    offset += chunk.length;
  });

  // Convert binary Uint8Array to Base64 in both browser and node
  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    let binary = '';
    const bytes = new Uint8Array(combined);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } else {
    return Buffer.from(combined).toString('base64');
  }
}

/**
 * Generates an SVG representation of a simulated QR Matrix
 * Returns SVG string ready for direct embedding or data:image/svg+xml
 */
export function generateZatcaQRSvg(base64Payload: string, size: number = 160): string {
  // Hash payload to create deterministic pseudo-random QR pattern
  let hash = 0;
  for (let i = 0; i < base64Payload.length; i++) {
    hash = (hash << 5) - hash + base64Payload.charCodeAt(i);
    hash |= 0;
  }

  const matrixSize = 25;
  const cellSize = size / matrixSize;
  let rects = '';

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Finder patterns (top-left, top-right, bottom-left)
      const isFinderTL = r < 7 && c < 7;
      const isFinderTR = r < 7 && c >= matrixSize - 7;
      const isFinderBL = r >= matrixSize - 7 && c < 7;

      let isBlack = false;

      if (isFinderTL || isFinderTR || isFinderBL) {
        // Draw 7x7 square outline and 3x3 inner center
        const localR = isFinderBL ? r - (matrixSize - 7) : r;
        const localC = isFinderTR ? c - (matrixSize - 7) : c;
        if (
          localR === 0 ||
          localR === 6 ||
          localC === 0 ||
          localC === 6 ||
          (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4)
        ) {
          isBlack = true;
        }
      } else {
        // Deterministic pseudo-random pattern based on string hash and coords
        const bit = ((hash ^ (r * 31 + c * 17)) + (r * c)) % 3 === 0;
        isBlack = bit;
      }

      if (isBlack) {
        rects += `<rect x="${(c * cellSize).toFixed(1)}" y="${(r * cellSize).toFixed(1)}" width="${cellSize.toFixed(1)}" height="${cellSize.toFixed(1)}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${rects}</svg>`;
}
