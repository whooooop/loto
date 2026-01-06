// i18n composable for internationalization

import { ref, computed } from 'vue'
import en from '../locales/en'
import ru from '../locales/ru'
import { storage } from '../utils/storage'

const DEFAULT_LOCALE = 'en'

const translations = {
  en,
  ru
}

const currentLocale = ref(storage.loadLocale() || DEFAULT_LOCALE)

export function useI18n() {
  // Get translation by key path (e.g., 'game.setup' -> translations.en.game.setup)
  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations[currentLocale.value]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key // Return key if translation not found
          }
        }
        break
      }
    }
    
    // Replace placeholders with params
    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match
      })
    }
    
    return value || key
  }

  // Set locale
  const setLocale = (locale) => {
    if (translations[locale]) {
      currentLocale.value = locale
      storage.saveLocale(locale)
    }
  }

  // Get current locale
  const locale = computed(() => currentLocale.value)

  // Get available locales
  const availableLocales = computed(() => [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ])

  return {
    t,
    locale,
    setLocale,
    availableLocales
  }
}

