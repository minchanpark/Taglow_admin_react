export type QrExportFormat = 'png' | 'svg';

export type QrExportResult = Readonly<{
  fileName: string;
  format: QrExportFormat;
  byteLength: number;
}>;
