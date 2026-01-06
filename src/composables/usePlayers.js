import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { validation } from '../utils/validation'
import { debounce } from '../utils/debounce'

export function usePlayers() {
  const players = ref(storage.loadPlayers())

  // Save players to localStorage with debounce
  const savePlayersDebounced = debounce(() => {
    storage.savePlayers(players.value)
  }, 300)
  
  const savePlayers = () => {
    savePlayersDebounced()
  }

  // Add a new player
  const addPlayer = (name, initialBalance = 0, t = null) => {
    // Validate name
    const nameValidation = validation.validatePlayerName(name, t)
    if (!nameValidation.valid) {
      const errorMsg = t ? t(nameValidation.errorKey) : nameValidation.errorKey
      throw new Error(errorMsg)
    }
    
    // Validate balance
    const balanceValidation = validation.validateBalance(initialBalance, t)
    if (!balanceValidation.valid) {
      const errorMsg = t ? t(balanceValidation.errorKey) : balanceValidation.errorKey
      throw new Error(errorMsg)
    }
    
    // Check for duplicate names
    const trimmedName = name.trim()
    if (players.value.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      const errorMsg = t ? t('validation.duplicatePlayerName') : 'Player with this name already exists'
      throw new Error(errorMsg)
    }
    
    const newPlayer = {
      id: Date.now().toString(),
      name: trimmedName,
      balance: balanceValidation.value,
      createdAt: new Date().toISOString()
    }
    players.value.push(newPlayer)
    savePlayers()
    return newPlayer
  }

  // Remove a player
  const removePlayer = (playerId) => {
    const index = players.value.findIndex(p => p.id === playerId)
    if (index !== -1) {
      players.value.splice(index, 1)
      savePlayers()
    }
  }

  // Update player balance
  const updateBalance = (playerId, amount) => {
    const player = players.value.find(p => p.id === playerId)
    if (player) {
      player.balance = parseFloat(player.balance) + parseFloat(amount)
      savePlayers()
    }
  }

  // Set player balance
  const setBalance = (playerId, balance) => {
    const player = players.value.find(p => p.id === playerId)
    if (player) {
      player.balance = parseFloat(balance) || 0
      savePlayers()
    }
  }

  // Update player name
  const updatePlayerName = (playerId, newName, t = null) => {
    const player = players.value.find(p => p.id === playerId)
    if (!player) {
      return false
    }

    // Validate name
    const nameValidation = validation.validatePlayerName(newName, t)
    if (!nameValidation.valid) {
      const errorMsg = t ? t(nameValidation.errorKey) : nameValidation.errorKey
      throw new Error(errorMsg)
    }

    // Check for duplicate names (excluding current player)
    const trimmedName = newName.trim()
    if (players.value.some(p => p.id !== playerId && p.name.toLowerCase() === trimmedName.toLowerCase())) {
      const errorMsg = t ? t('validation.duplicatePlayerName') : 'Player with this name already exists'
      throw new Error(errorMsg)
    }

    player.name = trimmedName
    savePlayers()
    return true
  }

  // Get player by ID
  const getPlayer = (playerId) => {
    return players.value.find(p => p.id === playerId)
  }

  // Get players by IDs
  const getPlayersByIds = (playerIds) => {
    return players.value.filter(p => playerIds.includes(p.id))
  }

  // Reset all players
  const resetAll = () => {
    players.value = []
    savePlayers()
  }

  return {
    players: computed(() => players.value),
    addPlayer,
    removePlayer,
    updateBalance,
    setBalance,
    updatePlayerName,
    getPlayer,
    getPlayersByIds,
    savePlayers,
    resetAll
  }
}

