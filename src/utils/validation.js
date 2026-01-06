// Validation utilities

export const validation = {
  // Validate player name
  validatePlayerName(name, t) {
    if (!name || typeof name !== 'string') {
      return { valid: false, errorKey: 'validation.playerNameRequired' }
    }
    
    const trimmed = name.trim()
    if (trimmed.length === 0) {
      return { valid: false, errorKey: 'validation.playerNameEmpty' }
    }
    
    if (trimmed.length > 50) {
      return { valid: false, errorKey: 'validation.playerNameTooLong' }
    }
    
    return { valid: true }
  },

  // Validate balance
  validateBalance(balance, t) {
    if (balance === null || balance === undefined || balance === '') {
      return { valid: false, errorKey: 'validation.balanceRequired' }
    }
    
    const num = parseFloat(balance)
    if (isNaN(num)) {
      return { valid: false, errorKey: 'validation.balanceMustBeNumber' }
    }
    
    if (num < -1000000 || num > 1000000) {
      return { valid: false, errorKey: 'validation.balanceOutOfRange' }
    }
    
    return { valid: true, value: num }
  },

  // Validate start bet
  validateStartBet(bet, t) {
    if (!bet || bet === 0) {
      return { valid: false, errorKey: 'validation.startBetRequired' }
    }
    
    const num = parseFloat(bet)
    if (isNaN(num) || num <= 0) {
      return { valid: false, errorKey: 'validation.startBetPositive' }
    }
    
    if (num > 100000) {
      return { valid: false, errorKey: 'validation.startBetTooLarge' }
    }
    
    return { valid: true, value: num }
  },

  // Validate player selection
  validatePlayerSelection(playerIds, t) {
    if (!Array.isArray(playerIds) || playerIds.length < 2) {
      return { valid: false, errorKey: 'validation.minTwoPlayers' }
    }
    
    if (playerIds.length > 10) {
      return { valid: false, errorKey: 'validation.maxTenPlayers' }
    }
    
    return { valid: true }
  }
}

