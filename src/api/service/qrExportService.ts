import type { QrExportResult } from '../model';
import type { BrowserDownloadHelper } from '../../utils';

export interface QrExportService {
  downloadParticipantQr(input: {
    voteId: string;
    payload: string;
    size?: number;
  }): Promise<QrExportResult>;
}

export class SvgQrExportService implements QrExportService {
  constructor(private readonly downloadHelper: BrowserDownloadHelper) {}

  async downloadParticipantQr(input: {
    voteId: string;
    payload: string;
    size?: number;
  }): Promise<QrExportResult> {
    const size = input.size ?? 1024;
    const fileName = `taglow-${input.voteId}-participant-qr.svg`;
    const escapedPayload = input.payload
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
    const content = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="100%" height="100%" fill="white"/><rect x="${size * 0.16}" y="${size * 0.16}" width="${size * 0.68}" height="${size * 0.68}" fill="none" stroke="#111827" stroke-width="24"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-size="28" fill="#111827">TAGLOW QR</text><text x="50%" y="${size * 0.6}" text-anchor="middle" font-family="monospace" font-size="18" fill="#4b5563">${escapedPayload}</text></svg>`;
    const byteLength = await this.downloadHelper.downloadTextFile({
      fileName,
      content,
      mimeType: 'image/svg+xml',
    });
    return { fileName, format: 'svg', byteLength };
  }
}
