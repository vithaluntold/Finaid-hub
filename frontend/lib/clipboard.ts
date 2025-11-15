/**
 * Safe clipboard utilities to prevent clipboard API errors
 */

export const safeClipboard = {
  /**
   * Safely write text to clipboard with fallback
   */
  async writeText(text: string): Promise<boolean> {
    try {
      // Check if clipboard API is available and permissions are granted
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      console.warn('Clipboard API failed, using fallback:', error);
    }

    // Fallback method using execCommand (deprecated but more compatible)
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    } catch (fallbackError) {
      console.error('All clipboard methods failed:', fallbackError);
      return false;
    }
  },

  /**
   * Safely read text from clipboard
   */
  async readText(): Promise<string | null> {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText();
      }
    } catch (error) {
      console.warn('Clipboard read failed:', error);
    }
    return null;
  },

  /**
   * Check if clipboard operations are supported
   */
  isSupported(): boolean {
    return !!(navigator.clipboard || document.execCommand);
  }
};