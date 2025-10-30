import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ICU from 'i18next-icu'

// JSON-ресурсы
import en from './locales/en/common.json'
import ru from './locales/ru/common.json'
import he from './locales/he/common.json'

// Укажем список поддерживаемых lng как литеральный union
export type AppLang = 'en' | 'ru' | 'he'
const isAppLang = (x: string): x is AppLang => ['en', 'ru', 'he'].includes(x)

// Простейшее хранение выбора языка
const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lng') : null
const initialLng: AppLang = saved && isAppLang(saved) ? saved : 'en'

// Проставление dir/lang для RTL/LTR
export const applyDir = (lng: AppLang) => {
  const isRTL = lng === 'he'
  const html = document.documentElement
  html.setAttribute('lang', lng)
  html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
}

// Типизированные ресурсы
export const resources = {
  en: { common: en },
  ru: { common: ru },
  he: { common: he }
} as const

i18n
  // @ts-expect-error: типы для i18next-icu не детализированы, но плагин работает корректно
  .use(ICU())
  .use(initReactI18next)
  .init({
    lng: initialLng,
    fallbackLng: 'en',
    debug: false,
    resources,
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false }
  })

i18n.on('languageChanged', (lng) => {
  if (isAppLang(lng)) {
    try { window.localStorage.setItem('lng', lng) } catch { /* empty */ }
    applyDir(lng)
  }
})

if (typeof window !== 'undefined') {
  applyDir(initialLng)
}

export default i18n
