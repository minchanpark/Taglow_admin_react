export interface BrowserDownloadHelper {
  downloadTextFile(input: {
    fileName: string;
    content: string;
    mimeType: string;
  }): Promise<number>;
}

export class BrowserBlobDownloadHelper implements BrowserDownloadHelper {
  async downloadTextFile(input: {
    fileName: string;
    content: string;
    mimeType: string;
  }): Promise<number> {
    const blob = new Blob([input.content], { type: input.mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = input.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return blob.size;
  }
}
