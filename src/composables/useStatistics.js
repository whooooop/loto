import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { GAME_STATUS, ROW_TYPES, MAX_GAME_HISTORY } from '../constants/game'

export function useStatistics() {
  const statistics = ref(storage.loadStatistics() || {
    totalGames: 0,
    totalWins: {},
    totalEarnings: {},
    gameHistory: []
  })

  // Save statistics
  const saveStatistics = () => {
    storage.saveStatistics(statistics.value)
  }

  // Update statistics after game ends
  const updateGameStatistics = (game, playersComposable) => {
    if (!game || game.status !== GAME_STATUS.FINISHED) return

    statistics.value.totalGames++

    // Find winner (player who collected bottom)
    const winner = game.players.find(p => p.collectedRows.includes(ROW_TYPES.BOTTOM))
    if (winner) {
      const playerId = winner.playerId
      const player = playersComposable.getPlayer(playerId)
      
      if (player) {
        // Update wins
        if (!statistics.value.totalWins[playerId]) {
          statistics.value.totalWins[playerId] = 0
        }
        statistics.value.totalWins[playerId]++

        // Calculate earnings for this game
        const initialBank = game.startBet * game.players.length
        const earnings = game.bank - game.startBet // Net earnings (bank minus initial contribution)
        
        if (!statistics.value.totalEarnings[playerId]) {
          statistics.value.totalEarnings[playerId] = 0
        }
        statistics.value.totalEarnings[playerId] += earnings
      }
    }

    // Calculate bank information
    const initialBank = game.startBet * game.players.length
    const finalBank = game.finalBank || initialBank
    const bankChange = finalBank - initialBank
    
    // Add to game history
    const historyEntry = {
      gameId: game.id,
      startDate: game.startDate,
      endDate: game.endDate,
      startBet: game.startBet,
      initialBank: initialBank,
      finalBank: finalBank,
      bankChange: bankChange,
      players: game.players.map(p => ({
        playerId: p.playerId,
        playerName: playersComposable.getPlayer(p.playerId)?.name || 'Unknown',
        collectedRows: p.collectedRows,
        contributions: p.contributions
      })),
      winner: winner ? {
        playerId: winner.playerId,
        playerName: playersComposable.getPlayer(winner.playerId)?.name || 'Unknown'
      } : null
    }

    statistics.value.gameHistory.unshift(historyEntry)
    
    // Keep only last N games in history
    if (statistics.value.gameHistory.length > MAX_GAME_HISTORY) {
      statistics.value.gameHistory = statistics.value.gameHistory.slice(0, MAX_GAME_HISTORY)
    }

    saveStatistics()
  }

  // Get player statistics
  const getPlayerStatistics = (playerId) => {
    return {
      wins: statistics.value.totalWins[playerId] || 0,
      earnings: statistics.value.totalEarnings[playerId] || 0
    }
  }

  // Get current game statistics
  const getCurrentGameStats = (game, playersComposable) => {
    if (!game) return null

    return {
      gameId: game.id,
      startDate: game.startDate,
      startBet: game.startBet,
      bank: game.bank,
      players: game.players.map(p => {
        const player = playersComposable.getPlayer(p.playerId)
        return {
          playerId: p.playerId,
          name: player?.name || 'Unknown',
          collectedRows: p.collectedRows,
          contributions: p.contributions
        }
      })
    }
  }

  // Reset statistics
  const resetStatistics = () => {
    statistics.value = {
      totalGames: 0,
      totalWins: {},
      totalEarnings: {},
      gameHistory: []
    }
    saveStatistics()
  }

  return {
    statistics: computed(() => statistics.value),
    updateGameStatistics,
    getPlayerStatistics,
    getCurrentGameStats,
    resetStatistics
  }
}

