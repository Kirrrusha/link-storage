/**
 * Проверяет, является ли строка валидным URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Извлекает домен из URL
 */
export function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Форматирует URL для отображения (убирает протокол и www)
 */
export function formatUrlForDisplay(url: string): string {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;

    // Убираем www. если есть
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }

    return hostname + urlObj.pathname;
  } catch {
    return url;
  }
}