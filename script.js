import { CONTACT_DELAY, FORMSPREE_ENDPOINT } from './config.js'
import {
  getThemeByHour,
  saveSystemInfo,
  getStorageEntries,
  hasSeenContact,
  rememberContact,
  validatePhone,
} from './shared/browser.js'
import {
  fetchReviews,
  reviewSource,
  sendContact,
  isFormConfigured,
} from './shared/requests.js'

// 1. Автоматична тема за часом і ручний вибір до перезавантаження.
const themeButton = document.getElementById('theme-toggle')
const autoButton = document.getElementById('theme-auto')
const themeStatus = document.getElementById('theme-status')
let automaticTheme = true
let currentTheme = getThemeByHour(new Date().getHours())

function applyTheme(theme) {
  currentTheme = theme
  document.documentElement.dataset.theme = theme
  themeButton.textContent = theme === 'dark' ? 'Світла тема' : 'Темна тема'
  themeStatus.textContent = `${theme === 'dark' ? 'Темна' : 'Світла'} тема · ${automaticTheme ? 'за часом' : 'ручний вибір'}`
  autoButton.setAttribute('aria-pressed', String(automaticTheme))
}

themeButton.addEventListener('click', () => {
  automaticTheme = false
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark')
})

autoButton.addEventListener('click', () => {
  automaticTheme = true
  applyTheme(getThemeByHour(new Date().getHours()))
})

applyTheme(currentTheme)
setInterval(() => {
  if (automaticTheme) applyTheme(getThemeByHour(new Date().getHours()))
}, 60_000)

// 2. Збереження системних даних та читання всього localStorage у футері.
const storageList = document.getElementById('storage-list')
const storageStatus = document.getElementById('storage-status')

function displayStorage() {
  const saved = saveSystemInfo()
  storageStatus.textContent = saved
    ? 'Дані збережено локально в цьому браузері. Точність відомостей залежить від браузера.'
    : 'Браузер заборонив localStorage. Сторінка продовжує працювати.'
  storageList.replaceChildren()

  for (const [key, value] of getStorageEntries()) {
    const term = document.createElement('dt')
    const description = document.createElement('dd')
    term.textContent = key
    try {
      description.textContent = JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      description.textContent = value
    }
    storageList.append(term, description)
  }
}

displayStorage()
window.addEventListener('storage', displayStorage)
document
  .getElementById('refresh-storage')
  .addEventListener('click', displayStorage)

// 3. Відгуки з API. Текст із сервера вставляється без виконання HTML.
const reviewList = document.getElementById('review-list')
const reviewStatus = document.getElementById('review-status')
const retryButton = document.getElementById('retry-reviews')
document.getElementById('review-source').textContent = reviewSource.description
const sourceSwitch = document.getElementById('review-source-switch')
sourceSwitch.href = reviewSource.switchUrl
sourceSwitch.textContent = reviewSource.switchLabel

async function loadReviews() {
  retryButton.disabled = true
  reviewStatus.textContent = 'Завантажую відгуки…'
  reviewList.replaceChildren()

  try {
    const reviews = await fetchReviews(AbortSignal.timeout(15_000))
    for (const review of reviews) {
      const card = document.createElement('article')
      const title = document.createElement('h3')
      const email = document.createElement('p')
      const body = document.createElement('p')
      title.textContent = review.name
      email.textContent = review.email
      email.className = 'review-email'
      body.textContent = review.body
      card.append(title, email, body)
      reviewList.append(card)
    }
    reviewStatus.textContent = reviews.length
      ? `Отримано відгуків: ${reviews.length}`
      : 'Для цього запису відгуків немає.'
  } catch {
    reviewStatus.textContent =
      'Не вдалося завантажити відгуки. Перевірте джерело даних і натисніть «Повторити».'
  } finally {
    retryButton.disabled = false
  }
}

retryButton.addEventListener('click', loadReviews)
loadReviews()

// 4. Модальне вікно: автоматично через хвилину, вручну — у будь-який час.
const dialog = document.getElementById('contact-dialog')
const contactForm = document.getElementById('contact-form')
const formStatus = document.getElementById('form-status')
const submitButton = contactForm.querySelector('button[type="submit"]')
const phoneInput = contactForm.elements.phone
const sessionKey = 'lab4.html.contactSeen'
let contactTimer
let previousFocus

function openContact() {
  clearTimeout(contactTimer)
  rememberContact(sessionKey)
  if (!dialog.open) {
    previousFocus = document.activeElement
    dialog.showModal()
  }
}

function closeContact() {
  dialog.close()
  previousFocus?.focus()
}

if (isFormConfigured()) contactForm.action = FORMSPREE_ENDPOINT
formStatus.textContent = isFormConfigured()
  ? 'Повідомлення буде надіслано через Formspree.'
  : 'Надсилання ще не налаштовано: потрібен endpoint Formspree.'

if (!hasSeenContact(sessionKey)) {
  contactTimer = setTimeout(openContact, CONTACT_DELAY)
}

document.getElementById('open-contact').addEventListener('click', openContact)
document.getElementById('close-contact').addEventListener('click', closeContact)
dialog.addEventListener('cancel', (event) => {
  event.preventDefault()
  closeContact()
})

phoneInput.addEventListener('input', () => phoneInput.setCustomValidity(''))

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (!validatePhone(phoneInput.value)) {
    phoneInput.setCustomValidity(
      'Укажіть телефон із 7–15 цифр. Дозволені +, пробіли, дужки та дефіс.',
    )
    phoneInput.reportValidity()
    return
  }
  if (submitButton.disabled) return

  submitButton.disabled = true
  formStatus.textContent = 'Надсилаю…'
  try {
    await sendContact(new FormData(contactForm))
    contactForm.reset()
    formStatus.textContent = 'Повідомлення прийнято Formspree. Дякую!'
  } catch (error) {
    formStatus.textContent =
      error.name === 'TimeoutError'
        ? 'Сервер не відповів вчасно. Перевірте з’єднання.'
        : error.message
  } finally {
    submitButton.disabled = false
  }
})
