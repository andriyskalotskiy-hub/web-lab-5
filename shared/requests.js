import { FORMSPREE_ENDPOINT, REVIEWS_URL } from '../config.js'
// Кожен режим читає одне джерело цілком, без підстановки текстів.
const original = new URLSearchParams(window.location.search).get('reviews') === 'original'

export const reviewSource = original
  ? {
      url: REVIEWS_URL,
      description: 'Оригінальні демонстраційні записи з JSONPlaceholder для варіанта 22.',
      switchUrl: './#reviews',
      switchLabel: 'Українські відгуки з JSON-файлу',
    }
  : {
      url: new URL('../data/comments-22.uk.json', import.meta.url).href,
      description: 'Українські навчальні відгуки з файлу comments-22.uk.json.',
      switchUrl: '?reviews=original#reviews',
      switchLabel: 'Оригінал із JSONPlaceholder',
    }

export function isFormConfigured() {
  return /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(FORMSPREE_ENDPOINT)
}

export async function fetchReviews(signal) {
  const response = await fetch(reviewSource.url, { signal })
  if (!response.ok) {
    throw new Error(`Сервер відгуків повернув HTTP ${response.status}.`)
  }

  const reviews = await response.json()
  if (
    !Array.isArray(reviews) ||
    reviews.some(
      (review) =>
        !review ||
        typeof review.id !== 'number' ||
        typeof review.name !== 'string' ||
        typeof review.email !== 'string' ||
        typeof review.body !== 'string',
    )
  ) {
    throw new Error('Сервер повернув неочікуваний формат відгуків.')
  }
  return reviews
}

export async function sendContact(formData) {
  if (!isFormConfigured()) {
    throw new Error(
      'Надсилання ще не налаштовано. Потрібно додати endpoint Formspree у config.js.',
    )
  }

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: formData,
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(20_000),
  })

  if (!response.ok) {
    throw new Error(
      `Не вдалося надіслати повідомлення (HTTP ${response.status}). Спробуйте пізніше.`,
    )
  }
}
