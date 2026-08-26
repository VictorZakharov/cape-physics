interface ClipboardEnvironment {
  readonly clipboard?: Pick<Clipboard, 'writeText'>;
  readonly document: Document;
}

export async function copyText(
  text: string,
  environment: ClipboardEnvironment = {
    clipboard: navigator.clipboard,
    document,
  },
): Promise<void> {
  if (environment.clipboard?.writeText) {
    await environment.clipboard.writeText(text);
    return;
  }

  const textarea = environment.document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  environment.document.body.append(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const copied = environment.document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Clipboard copy was rejected.');
}
