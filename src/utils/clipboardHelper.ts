export interface ClipboardHelper {
  copyText(text: string): Promise<void>;
}

export class BrowserClipboardHelper implements ClipboardHelper {
  async copyText(text: string): Promise<void> {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', 'true');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(input);
    if (!copied) {
      throw new Error('클립보드 복사에 실패했습니다.');
    }
  }
}
