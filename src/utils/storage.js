// Storage utilities for localStorage

import { STORAGE_KEYS } from '../constants/game'

export const storage = {
  // Players
  savePlayers(players) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players))
    } catch (error) {
      console.error('Error saving players:', error)
    }
  },

  loadPlayers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYERS)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading players:', error)
      return []
    }
  },

  // Games
  saveGames(games) {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games))
    } catch (error) {
      console.error('Error saving games:', error)
    }
  },

  loadGames() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMES)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading games:', error)
      return []
    }
  },

  // Statistics
  saveStatistics(statistics) {
    try {
      localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics))
    } catch (error) {
      console.error('Error saving statistics:', error)
    }
  },

  loadStatistics() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATISTICS)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading statistics:', error)
      return null
    }
  },

  // Locale
  loadLocale() {
    try {
      return localStorage.getItem(STORAGE_KEYS.SETTINGS) 
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS))?.locale || 'en'
        : 'en'
    } catch (error) {
      console.error('Error loading locale:', error)
      return 'en'
    }
  },

  saveLocale(locale) {
    try {
      const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}')
      settings.locale = locale
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving locale:', error)
    }
  },

  // Clear all data
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.PLAYERS)
      localStorage.removeItem(STORAGE_KEYS.GAMES)
      localStorage.removeItem(STORAGE_KEYS.STATISTICS)
    } catch (error) {
      console.error('Error clearing all data:', error)
    }
  }
}

