// src/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ICU from 'i18next-icu'                 // <-- класс

// JSON-ресурсы
import en from './locales/en/common.json'
import ru from './locales/ru/common.json'
import he from './locales/he/common.json'

// Языки проекта
export type AppLang = 'en' | 'ru' | 'he'
const isAppLang = (x: string): x is AppLang => ['en', 'ru', 'he'].includes(x)

// Читаем выбранный язык из localStorage
const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lng') : null
const initialLng: AppLang = saved && isAppLang(saved) ? saved : 'en'

// Проставляем dir/lang для RTL/LTR
export const applyDir = (lng: AppLang) => {
  const isRTL = lng === 'he'
  const html = document.documentElement
  html.setAttribute('lang', lng)
  html.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
}

// Ресурсы
export const resources = {
  en: { common: en },
  ru: { common: ru },
  he: { common: he }
} as const

i18n
  .use(new ICU())                              // <-- ВАЖНО: экземпляр класса
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
