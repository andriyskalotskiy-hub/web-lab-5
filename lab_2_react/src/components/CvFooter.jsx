import { useEffect, useState } from 'react'
import { saveSystemInfo, getStorageEntries } from '../../shared/browser.js'

function formatValue(value) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2)
  } catch {
    return value
  }
}

export default function CvFooter() {
  const [entries, setEntries] = useState([])
  const [saved, setSaved] = useState(true)

  function refreshStorage() {
    setSaved(saveSystemInfo())
    setEntries(getStorageEntries())
  }

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- читаємо зовнішнє сховище за умовою лабораторної
    refreshStorage()
    window.addEventListener('storage', refreshStorage)
    return () => window.removeEventListener('storage', refreshStorage)
  }, [])

  return (
    <footer className="flex flex-wrap justify-between gap-5 border-t border-[var(--border)] pt-6 text-xs leading-relaxed text-[var(--muted)]">
      <p>
        <a
          href="https://github.com/andriyskalotskiy-hub"
          className="text-[var(--accent)] underline underline-offset-4"
        >
          Мій GitHub
        </a>
      </p>
      <p>Андрій Скалоцький · Навчальне резюме · 2026</p>
      <details className="w-full min-w-0">
        <summary className="cursor-pointer py-2 text-[var(--accent)]">
          Системна інформація та localStorage
        </summary>
        <p className="my-3" role="status">
          {saved
            ? 'Дані збережено локально в цьому браузері. Точність відомостей залежить від браузера.'
            : 'Браузер заборонив localStorage. Сторінка продовжує працювати.'}
        </p>
        <button
          type="button"
          onClick={refreshStorage}
          className="rounded-md border border-[var(--border)] px-3 py-2 hover:bg-[var(--hover)]"
        >
          Оновити дані
        </button>
        <dl>
          {entries.map(([key, value]) => (
            <div key={key} className="mt-4">
              <dt className="font-bold">{key}</dt>
              <dd className="mt-1 font-mono whitespace-pre-wrap wrap-anywhere">
                {formatValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </footer>
  )
}
