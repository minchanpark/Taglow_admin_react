export interface ExternalLinkLauncher {
  openNewTab(url: string): Promise<void>;
}

export class BrowserExternalLinkLauncher implements ExternalLinkLauncher {
  async openNewTab(url: string): Promise<void> {
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (!popup) {
      throw new Error('새 창 열기에 실패했습니다.');
    }
  }
}
