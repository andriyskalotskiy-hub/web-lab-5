export default function Education() {
  return (
    <section
      id="education"
      className="scroll-mt-6 rounded-xl border border-[var(--border)] bg-[var(--card)] p-[23px] shadow-lg shadow-black/10 min-[721px]:p-7"
    >
      <p className="mb-[9px] text-[11px] font-bold tracking-[0.16em] text-[var(--accent)]">
        02 / ОСВІТА
      </p>
      <h2 className="mb-[18px] text-[25px] leading-[1.3] font-bold tracking-[-0.025em] text-[var(--heading)]">
        Де навчаюся
      </h2>
      <h3 className="mt-5 mb-[7px] text-base leading-normal font-bold text-[var(--heading)]">
        Національний університет «Львівська політехніка»
      </h3>
      <p className="mb-3 leading-[1.7] last:mb-0 text-sm text-[var(--muted)]">
        Інститут ІКТА, спеціальність «Кібербезпека». Другий курс, група Кб-205.
      </p>
      <p className="mb-3 leading-[1.7] last:mb-0 text-sm text-[var(--muted)]">
        <a
          className="text-[var(--accent)] underline underline-offset-[5px] hover:text-[var(--heading)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          href="https://lpnu.ua/"
        >
          Сайт університету
        </a>
      </p>
      <h3 className="mt-5 mb-[7px] text-base leading-normal font-bold text-[var(--heading)]">
        Березнівський ліцей № 1
      </h3>
      <p className="mb-3 leading-[1.7] last:mb-0 text-sm text-[var(--muted)]">
        Повна загальна середня освіта з відзнакою.
      </p>
    </section>
  )
}
