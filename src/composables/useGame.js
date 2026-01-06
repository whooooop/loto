import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { generateLotoCard } from '../utils/lotoUtils'
import { GAME_STATUS, ROW_TYPES, MAX_ACTION_HISTORY } from '../constants/game'
import { debounce } from '../utils/debounce'

export function useGame(playersComposable) {
  const currentGame = ref(null)
  const games = ref(storage.loadGames())

  // Save games to localStorage with debounce
  const saveGamesDebounced = debounce(() => {
    storage.saveGames(games.value)
  }, 300)
  
  const saveGames = () => {
    saveGamesDebounced()
  }

  // Create a new game
  const createGame = (playerIds, startBet, t = null) => {
    const gameId = Date.now().toString()
    const startBetAmount = parseFloat(startBet) || 0
    
    // Deduct start bet from all players
    const gamePlayers = playerIds.map(playerId => {
      const player = playersComposable.getPlayer(playerId)
      if (player) {
        playersComposable.updateBalance(playerId, -startBetAmount)
        return {
          playerId: playerId,
          card: generateLotoCard(),
          collectedRows: [],
          contributions: startBetAmount
        }
      }
      return null
    }).filter(p => p !== null)

    const bank = gamePlayers.reduce((sum, p) => sum + p.contributions, 0)

    const startDescription = t 
      ? t('log.gameStarted', { bet: startBetAmount, count: gamePlayers.length })
      : `Game started. Bet: ${startBetAmount}₽, players: ${gamePlayers.length}`

    const newGame = {
      id: gameId,
      startDate: new Date().toISOString(),
      endDate: null,
      startBet: startBetAmount,
      bank: bank,
      players: gamePlayers,
      status: GAME_STATUS.ACTIVE,
      eventLog: [{
        timestamp: new Date().toISOString(),
        type: 'start',
        description: startDescription
      }],
      actionHistory: []
    }

    currentGame.value = newGame
    games.value.push(newGame)
    saveGames()
    playersComposable.savePlayers()

    return newGame
  }

  // Save game state snapshot for undo
  const saveStateSnapshot = () => {
    if (!currentGame.value) return
    
    // Save player balances
    const playerBalances = {}
    currentGame.value.players.forEach(p => {
      const player = playersComposable.getPlayer(p.playerId)
      if (player) {
        playerBalances[p.playerId] = player.balance
      }
    })
    
    const snapshot = {
      bank: currentGame.value.bank,
      players: JSON.parse(JSON.stringify(currentGame.value.players)),
      playerBalances: playerBalances,
      status: currentGame.value.status,
      endDate: currentGame.value.endDate,
      eventLogLength: currentGame.value.eventLog.length
    }
    
    if (!currentGame.value.actionHistory) {
      currentGame.value.actionHistory = []
    }
    currentGame.value.actionHistory.push(snapshot)
    
    // Keep only last N actions
    if (currentGame.value.actionHistory.length > MAX_ACTION_HISTORY) {
      currentGame.value.actionHistory.shift()
    }
  }

  // Collect top row
  const collectTop = (playerId, t = null) => {
    if (!currentGame.value || currentGame.value.status !== GAME_STATUS.ACTIVE) return false
    
    const gamePlayer = currentGame.value.players.find(p => p.playerId === playerId)
    if (!gamePlayer) return false

    const player = playersComposable.getPlayer(playerId)
    if (!player) return false

    // Save state before action
    saveStateSnapshot()

    gamePlayer.collectedRows.push(ROW_TYPES.TOP)
    
    // All players add start bet except the one who collected top
    const startBet = currentGame.value.startBet
    currentGame.value.players.forEach(p => {
      if (p.playerId !== playerId) {
        const otherPlayer = playersComposable.getPlayer(p.playerId)
        if (otherPlayer) {
          playersComposable.updateBalance(p.playerId, -startBet)
          p.contributions += startBet
        }
      }
    })

    // Update bank
    currentGame.value.bank = currentGame.value.players.reduce((sum, p) => sum + p.contributions, 0)
    
    // Add to event log
    const description = t 
      ? t('log.collectedTop', { name: player.name })
      : `${player.name} collected top`
    
    currentGame.value.eventLog.push({
      timestamp: new Date().toISOString(),
      type: ROW_TYPES.TOP,
      playerId: playerId,
      playerName: player.name,
      description: description,
      actionType: 'top_collected'
    })
    
    saveGames()
    playersComposable.savePlayers()

    return true
  }

  // Collect middle row
  const collectMiddle = (playerId, t = null) => {
    if (!currentGame.value || currentGame.value.status !== GAME_STATUS.ACTIVE) return false
    
    const gamePlayer = currentGame.value.players.find(p => p.playerId === playerId)
    if (!gamePlayer) return false

    const player = playersComposable.getPlayer(playerId)
    if (!player) return false

    // Save state before action
    saveStateSnapshot()

    gamePlayer.collectedRows.push(ROW_TYPES.MIDDLE)
    
    // Winner takes half of the bank
    const halfBank = Math.floor(currentGame.value.bank / 2)
    playersComposable.updateBalance(playerId, halfBank)

    // All players add start bet except the one who collected middle
    const startBet = currentGame.value.startBet
    currentGame.value.players.forEach(p => {
      if (p.playerId !== playerId) {
        const otherPlayer = playersComposable.getPlayer(p.playerId)
        if (otherPlayer) {
          playersComposable.updateBalance(p.playerId, -startBet)
          p.contributions += startBet
        }
      }
    })

    // Update bank (subtract half that was taken, add contributions from other players)
    currentGame.value.bank = currentGame.value.bank - halfBank
    const additionalContributions = currentGame.value.players
      .filter(p => p.playerId !== playerId)
      .reduce((sum, p) => sum + startBet, 0)
    currentGame.value.bank += additionalContributions
    
    // Add to event log
    const description = t 
      ? t('log.collectedMiddle', { name: player.name, amount: halfBank })
      : `${player.name} collected middle (took ${halfBank}₽)`
    
    currentGame.value.eventLog.push({
      timestamp: new Date().toISOString(),
      type: ROW_TYPES.MIDDLE,
      playerId: playerId,
      playerName: player.name,
      description: description,
      amount: halfBank,
      actionType: 'withdrawal'
    })
    
    saveGames()
    playersComposable.savePlayers()

    return true
  }

  // Collect bottom row (game ends)
  const collectBottom = (playerId, t = null) => {
    if (!currentGame.value || currentGame.value.status !== GAME_STATUS.ACTIVE) return false
    
    const gamePlayer = currentGame.value.players.find(p => p.playerId === playerId)
    if (!gamePlayer || gamePlayer.collectedRows.includes(ROW_TYPES.BOTTOM)) return false

    const player = playersComposable.getPlayer(playerId)
    if (!player) return false

    // Save state before action
    saveStateSnapshot()

    gamePlayer.collectedRows.push(ROW_TYPES.BOTTOM)
    
    // Winner takes all bank
    const finalBank = currentGame.value.bank
    playersComposable.updateBalance(playerId, finalBank)

    // End game
    currentGame.value.status = GAME_STATUS.FINISHED
    currentGame.value.endDate = new Date().toISOString()
    currentGame.value.finalBank = finalBank // Save final bank before clearing
    currentGame.value.bank = 0
    
    // Add to event log
    const description = t 
      ? t('log.collectedBottom', { name: player.name, amount: finalBank })
      : `${player.name} collected bottom (took ${finalBank}₽) - game finished`
    
    currentGame.value.eventLog.push({
      timestamp: new Date().toISOString(),
      type: ROW_TYPES.BOTTOM,
      playerId: playerId,
      playerName: player.name,
      description: description,
      amount: finalBank,
      actionType: 'withdrawal'
    })
    
    saveGames()
    playersComposable.savePlayers()

    return true
  }

  // Check if last action was by specific player
  const canUndoPlayerAction = (playerId) => {
    if (!currentGame.value || !currentGame.value.eventLog || currentGame.value.eventLog.length === 0) {
      return false
    }
    
    const lastEvent = currentGame.value.eventLog[currentGame.value.eventLog.length - 1]
    return lastEvent.playerId === playerId && 
           (lastEvent.type === ROW_TYPES.TOP || lastEvent.type === ROW_TYPES.MIDDLE || lastEvent.type === ROW_TYPES.BOTTOM) &&
           currentGame.value.status === GAME_STATUS.ACTIVE
  }

  // Undo last action
  const undoLastAction = () => {
    if (!currentGame.value || !currentGame.value.actionHistory || currentGame.value.actionHistory.length === 0) {
      return false
    }

    const snapshot = currentGame.value.actionHistory.pop()
    
    // Restore game state
    currentGame.value.bank = snapshot.bank
    currentGame.value.status = snapshot.status
    currentGame.value.endDate = snapshot.endDate
    
    // Restore players state
    currentGame.value.players = snapshot.players.map(snapPlayer => {
      const gamePlayer = currentGame.value.players.find(p => p.playerId === snapPlayer.playerId)
      if (gamePlayer) {
        // Restore collected rows
        gamePlayer.collectedRows = [...snapPlayer.collectedRows]
        gamePlayer.contributions = snapPlayer.contributions
      }
      return gamePlayer || snapPlayer
    })

    // Restore player balances from snapshot
    Object.keys(snapshot.playerBalances).forEach(playerId => {
      const player = playersComposable.getPlayer(playerId)
      if (player) {
        const savedBalance = snapshot.playerBalances[playerId]
        playersComposable.setBalance(playerId, savedBalance)
      }
    })

    // Remove last event from log
    if (currentGame.value.eventLog.length > snapshot.eventLogLength) {
      currentGame.value.eventLog.pop()
    }
    
    saveGames()
    playersComposable.savePlayers()

    return true
  }

  // Undo last action for specific player
  const undoPlayerLastAction = (playerId) => {
    if (!canUndoPlayerAction(playerId)) {
      return false
    }
    return undoLastAction()
  }

  // Load current active game
  const loadActiveGame = () => {
    const activeGame = games.value.find(g => g.status === GAME_STATUS.ACTIVE)
    if (activeGame) {
      // Initialize actionHistory if not present
      if (!activeGame.actionHistory) {
        activeGame.actionHistory = []
      }
      currentGame.value = activeGame
    }
  }

  // Clear current game
  const clearCurrentGame = () => {
    currentGame.value = null
  }

  // Reset all games
  const resetAll = () => {
    currentGame.value = null
    games.value = []
    saveGames()
  }

  return {
    currentGame: computed(() => currentGame.value),
    games: computed(() => games.value),
    createGame,
    collectTop,
    collectMiddle,
    collectBottom,
    loadActiveGame,
    clearCurrentGame,
    resetAll,
    undoLastAction,
    undoPlayerLastAction,
    canUndoPlayerAction
  }
}

