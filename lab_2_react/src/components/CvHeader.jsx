import ContactForm from './ContactForm'

export default function CvHeader({
  name,
  group,
  theme,
  automaticTheme,
  onToggleTheme,
  onAutomaticTheme,
}) {
  return (
    <header className="border-b border-[var(--border)] pb-10">
      <p className="text-[11px] font-bold tracking-[0.16em] text-[var(--accent)]">
        ОСОБИСТЕ РЕЗЮМЕ / 2026
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            {theme === 'dark' ? 'Світла тема' : 'Темна тема'}
          </button>
          <button
            type="button"
            onClick={onAutomaticTheme}
            aria-pressed={automaticTheme}
            className="rounded-md border border-[var(--accent)] px-3 py-2 text-sm hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          >
            За часом
          </button>
          <span role="status" className="text-xs text-[var(--muted)]">
            {theme === 'dark' ? 'Темна' : 'Світла'} тема ·{' '}
            {automaticTheme ? 'за часом' : 'ручний вибір'}
          </span>
        </div>
        <ContactForm />
      </div>
      <h1 className="my-6 text-[clamp(40px,6.3vw,76px)] leading-[1.08] font-bold tracking-[-0.045em] text-[var(--accent)]">
        {name}
      </h1>
      <p className="my-2 leading-[1.7] text-[var(--muted)]">
        Студент кібербезпеки · захист даних · ігри та модифікації
      </p>
      <p className="my-2 leading-[1.7] text-[var(--muted)]">
        Другий курс · група {group}
      </p>
      <nav
        className="mt-[26px] flex flex-wrap gap-2.5"
        aria-label="Розділи резюме"
      >
        <a
          className="rounded-md border border-[var(--border)] px-3.5 py-[7px] text-[13px] transition-colors hover:border-[var(--accent)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          href="#about"
        >
          Про мене
        </a>
        <a
          className="rounded-md border border-[var(--border)] px-3.5 py-[7px] text-[13px] transition-colors hover:border-[var(--accent)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          href="#education"
        >
          Освіта
        </a>
        <a
          className="rounded-md border border-[var(--border)] px-3.5 py-[7px] text-[13px] transition-colors hover:border-[var(--accent)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          href="#projects"
        >
          Навчальні роботи
        </a>
        <a
          className="rounded-md border border-[var(--border)] px-3.5 py-[7px] text-[13px] transition-colors hover:border-[var(--accent)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          href="#skills"
        >
          Навички
        </a>
        <a
          className="rounded-md border border-[var(--border)] px-3.5 py-[7px] text-[13px] transition-colors hover:border-[var(--accent)] hover:bg-[var(--hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          href="#interests"
        >
          Інтереси та цілі
        </a>
        <a
          href="#reviews"
          className="rounded-md border border-[var(--border)] px-3.5 py-[7px] text-[13px] hover:border-[var(--accent)] hover:bg-[var(--hover)]"
        >
          Відгуки
        </a>
      </nav>
    </header>
  )
}
