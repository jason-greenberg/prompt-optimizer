// Function to handle the copy-to-clipboard functionality
export const copyToClipboardPlain = (text) => {
  navigator.clipboard.writeText(text)
};

export const copyToClipboardFormatted = async (text, html) => {
  try {
    if (typeof window.ClipboardItem === 'undefined') {
      throw new Error('ClipboardItem is not supported in this environment');
    }

    await navigator.clipboard.write([
      new window.ClipboardItem({
        'text/plain': new Blob([text], { type: 'text/plain' }),
        'text/html': new Blob([html], { type: 'text/html' }),
      }),
    ]);
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
  }
};
