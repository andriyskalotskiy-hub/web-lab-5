import { useEffect, useState } from 'react'
import { fetchReviews, reviewSource } from '../../shared/requests.js'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15_000)
    let active = true

    async function loadReviews() {
      setStatus('loading')
      try {
        const data = await fetchReviews(controller.signal)
        if (active) {
          setReviews(data)
          setStatus('ready')
        }
      } catch {
        if (active) setStatus('error')
      } finally {
        clearTimeout(timeout)
      }
    }

    loadReviews()
    return () => {
      active = false
      clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  return (
    <section
      id="reviews"
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 min-[721px]:col-span-2 min-[721px]:p-7"
    >
      <p className="mb-2 text-[11px] font-bold tracking-widest text-[var(--accent)]">
        06 / ЗВОРОТНИЙ ЗВ’ЯЗОК
      </p>
      <h2 className="mb-4 text-2xl font-bold text-[var(--heading)]">
        Навчальні відгуки
      </h2>
      <p className="mb-4 leading-relaxed text-[var(--muted)]">
        {reviewSource.description}
      </p>
      <p className="mb-4">
        <a className="text-[var(--accent)] underline" href={reviewSource.switchUrl}>
          {reviewSource.switchLabel}
        </a>
      </p>
      <p role="status" className="mb-4 text-sm">
        {status === 'loading' && 'Завантажую відгуки…'}
        {status === 'error' &&
          'Не вдалося завантажити відгуки. Перевірте джерело даних і повторіть спробу.'}
        {status === 'ready' &&
          (reviews.length
            ? `Отримано відгуків: ${reviews.length}`
            : 'Для цього запису відгуків немає.')}
      </p>
      {status === 'ready' && (
        <div className="grid gap-4 min-[721px]:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="min-w-0 rounded-lg border border-[var(--border)] p-5 wrap-anywhere"
            >
              <h3 className="mb-2 font-bold text-[var(--heading)]">
                {review.name}
              </h3>
              <p className="mb-3 text-sm text-[var(--accent)]">
                {review.email}
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {review.body}
              </p>
            </article>
          ))}
        </div>
      )}
      <button
        type="button"
        disabled={status === 'loading'}
        onClick={() => setAttempt(attempt + 1)}
        className="mt-5 rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] disabled:opacity-50"
      >
        Повторити
      </button>
    </section>
  )
}
