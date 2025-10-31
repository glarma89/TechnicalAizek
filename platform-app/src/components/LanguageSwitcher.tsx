import i18n from '../i18n'
import type { AppLang } from '../i18n'

type LangItem = { code: AppLang; label: string }

const langs: LangItem[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'he', label: 'עברית' }
]

export default function LanguageSwitcher() {
  const change = (lng: AppLang) => { void i18n.changeLanguage(lng) }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => change(l.code)}
          aria-label={`switch to ${l.code}`}
          type="button"
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
