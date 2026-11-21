/**
 * Stores the secret edit tokens of reviews written on this device,
 * so customers can edit only their own reviews.
 */
const STORAGE_KEY = 'pattan_my_reviews';

function readAll() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveEditToken(reviewId, token) {
  if (!reviewId || !token) return;
  const all = readAll();
  all[reviewId] = token;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}

export function getEditToken(reviewId) {
  return readAll()[reviewId] || null;
}

// Reverse the server-side HTML escaping so the edit form shows the original text
export function decodeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
}
