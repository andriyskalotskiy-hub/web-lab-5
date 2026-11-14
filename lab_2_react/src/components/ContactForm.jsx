import { useEffect, useRef, useState } from 'react'
import { CONTACT_DELAY, FORMSPREE_ENDPOINT } from '../../config.js'
import {
  hasSeenContact,
  rememberContact,
  validatePhone,
} from '../../shared/browser.js'
import { sendContact, isFormConfigured } from '../../shared/requests.js'

const sessionKey = 'lab4.react.contactSeen'
const fieldStyle =
  'w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--page)] px-3 py-2.5 text-base text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
const buttonStyle =
  'rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm hover:border-[var(--accent)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState(
    isFormConfigured()
      ? 'Повідомлення буде надіслано через Formspree.'
      : 'Надсилання ще не налаштовано: потрібен endpoint Formspree.',
  )
  const dialogRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!hasSeenContact(sessionKey)) {
      timerRef.current = setTimeout(() => {
        rememberContact(sessionKey)
        setIsOpen(true)
      }, CONTACT_DELAY)
    }
    return () => clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  function openContact() {
    clearTimeout(timerRef.current)
    rememberContact(sessionKey)
    setIsOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (sending) return
    const form = event.currentTarget
    const phone = form.elements.phone
    if (!validatePhone(phone.value)) {
      phone.setCustomValidity(
        'Укажіть телефон із 7–15 цифр. Дозволені +, пробіли, дужки та дефіс.',
      )
      phone.reportValidity()
      return
    }

    setSending(true)
    setStatus('Надсилаю…')
    try {
      await sendContact(new FormData(form))
      form.reset()
      setStatus('Повідомлення прийнято Formspree. Дякую!')
    } catch (error) {
      setStatus(
        error.name === 'TimeoutError'
          ? 'Сервер не відповів вчасно. Перевірте з’єднання.'
          : error.message,
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button type="button" onClick={openContact} className={buttonStyle}>
        Написати мені
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="contact-title"
        aria-describedby="contact-description"
        onCancel={(event) => {
          event.preventDefault()
          setIsOpen(false)
        }}
        className="m-auto max-h-[calc(100dvh-32px)] w-[min(560px,calc(100%-28px))] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--text)] shadow-2xl backdrop:bg-black/60 min-[721px]:p-7"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="contact-title"
            className="text-2xl font-bold text-[var(--heading)]"
          >
            Написати Андрію
          </h2>
          <button
            type="button"
            aria-label="Закрити форму"
            className={buttonStyle}
            onClick={() => setIsOpen(false)}
          >
            Закрити
          </button>
        </div>
        <p
          id="contact-description"
          className="mb-4 text-sm leading-relaxed text-[var(--muted)]"
        >
          Залиште повідомлення — воно надійде на мою пошту через Formspree.
        </p>
        <form
          action={FORMSPREE_ENDPOINT || undefined}
          method="POST"
          onSubmit={handleSubmit}
          className="grid gap-2.5"
        >
          <label htmlFor="contact-name" className="mt-1 text-sm font-semibold">
            Ім’я
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            className={fieldStyle}
          />
          <label htmlFor="contact-email" className="mt-1 text-sm font-semibold">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={150}
            className={fieldStyle}
          />
          <label htmlFor="contact-phone" className="mt-1 text-sm font-semibold">
            Номер телефону
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            maxLength={30}
            placeholder="+380…"
            onInput={(event) => event.currentTarget.setCustomValidity('')}
            className={fieldStyle}
          />
          <label
            htmlFor="contact-message"
            className="mt-1 text-sm font-semibold"
          >
            Повідомлення
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={5}
            maxLength={3000}
            rows={4}
            className={fieldStyle}
          />
          <input
            type="hidden"
            name="_subject"
            value="Повідомлення з резюме — лабораторна 4"
          />
          <p role="status" aria-live="polite" className="my-2 text-sm">
            {status}
          </p>
          <button
            type="submit"
            disabled={sending}
            className={`${buttonStyle} border-[var(--accent)] disabled:cursor-wait disabled:opacity-50`}
          >
            {sending ? 'Надсилаю…' : 'Надіслати'}
          </button>
        </form>
      </dialog>
    </>
  )
}
