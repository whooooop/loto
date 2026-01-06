// Formatting utilities composable
import { useI18n } from './useI18n'

export function useFormatting() {
  const { locale } = useI18n()

  const formatBalance = (balance) => {
    return new Intl.NumberFormat(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(balance)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(locale.value === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatNumber = (number) => {
    return number.toString().padStart(2, '0')
  }

  return {
    formatBalance,
    formatDate,
    formatTime,
    formatNumber
  }
}


