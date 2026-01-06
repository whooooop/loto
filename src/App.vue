<template>
  <div id="app">
    <header class="app-header">
      <h1>{{ t('app.title') }}</h1>
      <LanguageSwitcher />
    </header>

    <main class="app-main">
      <div class="sidebar">
        <PlayersBalance :players="players" />
        <PlayerManagement v-if="!currentGame" />
        <GameBank
          v-if="currentGame"
          :bank="currentGame.bank"
          :history="bankHistory"
        />
        <GameLog
          v-if="currentGame"
          :event-log="currentGame.eventLog || []"
        />
        <ResetData @reset="handleFullReset" />
      </div>

      <div class="main-content">
        <div v-if="!currentGame" class="no-game">
          <GameSetup
            :on-create-game="handleCreateGame"
          />
        </div>

        <div v-else>
          <div v-if="currentGame.status === GAME_STATUS.FINISHED" class="game-finished">
            <h2>{{ t('game.gameFinished') }}</h2>
            <p>{{ t('common.winner') }}: {{ getWinnerName() }}</p>
            <button @click="handleNewGame" class="new-game-btn">
              {{ t('game.newGame') }}
            </button>
          </div>

          <div v-else>
            <GameBoard
              :current-game="currentGame"
              :players="players"
              :on-collect-top="handleCollectTop"
              :on-collect-middle="handleCollectMiddle"
              :on-collect-bottom="handleCollectBottom"
              :on-undo="handleUndo"
              :can-undo="canUndo"
              :on-undo-player="handleUndoPlayer"
              :can-undo-player-action="canUndoPlayerAction"
            />
            <ConfirmDialog
              :show="showConfirmDialog"
              :title="confirmTitle"
              :message="confirmMessage"
              :confirm-text="confirmButtonText"
              @confirm="executeConfirmedAction"
              @cancel="cancelConfirmedAction"
            />
          </div>
        </div>
      </div>

      <div class="sidebar-right">
        <Statistics
          :current-game-stats="currentGameStats"
          :statistics="statistics"
          :players="players"
          :get-player-stats="getPlayerStatistics"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PlayerManagement from './components/PlayerManagement.vue'
import GameSetup from './components/GameSetup.vue'
import GameBoard from './components/GameBoard.vue'
import GameBank from './components/GameBank.vue'
import Statistics from './components/Statistics.vue'
import PlayersBalance from './components/PlayersBalance.vue'
import GameLog from './components/GameLog.vue'
import ResetData from './components/ResetData.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import { usePlayers } from './composables/usePlayers'
import { useGame } from './composables/useGame'
import { useStatistics } from './composables/useStatistics'
import { storage } from './utils/storage'
import { GAME_STATUS, ROW_TYPES } from './constants/game'
import { useI18n } from './composables/useI18n'

const playersComposable = usePlayers()
const { players, resetAll: resetPlayers } = playersComposable

const gameComposable = useGame(playersComposable)
const { currentGame, createGame, collectTop, collectMiddle, collectBottom, loadActiveGame, clearCurrentGame, resetAll: resetGames, undoLastAction, undoPlayerLastAction, canUndoPlayerAction } = gameComposable

const statisticsComposable = useStatistics()
const { statistics, updateGameStatistics, getPlayerStatistics, getCurrentGameStats, resetStatistics } = statisticsComposable

const { t } = useI18n()

const bankHistory = ref([])

// Confirm dialog state
const showConfirmDialog = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmButtonText = ref('Подтвердить')
const pendingAction = ref(null)
const pendingPlayerId = ref(null)

// Computed for undo availability
const canUndo = computed(() => {
  return currentGame.value && 
         currentGame.value.actionHistory && 
         currentGame.value.actionHistory.length > 0 &&
         currentGame.value.status === GAME_STATUS.ACTIVE
})

// Rebuild bank history from event log
const rebuildBankHistoryFromEvents = () => {
  if (!currentGame.value) return
  
  const newHistory = []
  const startBet = currentGame.value.startBet
  
  // Add initial contributions
  const players = playersComposable.getPlayersByIds(currentGame.value.players.map(p => p.playerId))
  players.forEach(player => {
    newHistory.push({
      type: 'contribution',
      playerId: player.id,
      playerName: player.name,
      amount: startBet,
      description: t('bank.playerContributed', { name: player.name, amount: startBet })
    })
  })
  
  // Process events (skip first 'start' event)
  const gameEvents = currentGame.value.eventLog?.filter(e => e.type !== 'start') || []
  gameEvents.forEach(event => {
    if (event.type === ROW_TYPES.TOP) {
      // All other players added start bet
      currentGame.value.players.forEach(p => {
        if (p.playerId !== event.playerId) {
          const otherPlayer = playersComposable.getPlayer(p.playerId)
          if (otherPlayer) {
            newHistory.push({
              type: 'contribution',
              playerId: p.playerId,
              playerName: otherPlayer.name,
              amount: startBet,
              description: t('bank.playerContributed', { name: otherPlayer.name, amount: startBet })
            })
          }
        }
      })
    } else if (event.type === ROW_TYPES.MIDDLE) {
      // Use amount from event or extract from description
      const halfBank = event.amount || (event.description?.match(/(\d+)/) ? parseInt(event.description.match(/(\d+)/)[1]) : 0)
      
      // Player withdrew half
      newHistory.push({
        type: 'withdrawal',
        playerId: event.playerId,
        playerName: event.playerName,
        amount: -halfBank,
        description: t('bank.playerWithdrew', { name: event.playerName, amount: halfBank })
      })
      
      // All other players added start bet
      currentGame.value.players.forEach(p => {
        if (p.playerId !== event.playerId) {
          const otherPlayer = playersComposable.getPlayer(p.playerId)
          if (otherPlayer) {
            newHistory.push({
              type: 'contribution',
              playerId: p.playerId,
              playerName: otherPlayer.name,
              amount: startBet,
              description: t('bank.playerContributed', { name: otherPlayer.name, amount: startBet })
            })
          }
        }
      })
    } else if (event.type === ROW_TYPES.BOTTOM) {
      // Use amount from event or extract from description
      const finalBank = event.amount || (event.description?.match(/(\d+)/) ? parseInt(event.description.match(/(\d+)/)[1]) : 0)
      
      // Player withdrew all
      newHistory.push({
        type: 'withdrawal',
        playerId: event.playerId,
        playerName: event.playerName,
        amount: -finalBank,
        description: t('bank.playerWithdrewAll', { name: event.playerName, amount: finalBank })
      })
    }
  })
  
  bankHistory.value = newHistory
}

// Load active game on mount
onMounted(() => {
  loadActiveGame()
  if (currentGame.value) {
    // Rebuild bank history from events
    rebuildBankHistoryFromEvents()
  }
})

// Watch for game status changes
watch(() => currentGame.value?.status, (newStatus) => {
  if (newStatus === GAME_STATUS.FINISHED && currentGame.value) {
    updateGameStatistics(currentGame.value, playersComposable)
  }
})

// Computed for current game stats
const currentGameStats = computed(() => {
  if (!currentGame.value) return null
  return getCurrentGameStats(currentGame.value, playersComposable)
})

// Handlers
const handleCreateGame = (playerIds, startBet) => {
  createGame(playerIds, startBet, t)
  const players = playersComposable.getPlayersByIds(playerIds)
  bankHistory.value = players.map(player => ({
    type: 'contribution',
    playerId: player.id,
    playerName: player.name,
    amount: startBet,
    description: t('bank.playerContributed', { name: player.name, amount: startBet })
  }))
}

const handleCollectTop = (playerId) => {
  const player = playersComposable.getPlayer(playerId)
  confirmTitle.value = t('confirm.title')
  confirmMessage.value = t('confirm.collectTop', { name: player?.name })
  confirmButtonText.value = t('confirm.yesCollectedTop')
  pendingAction.value = 'top'
  pendingPlayerId.value = playerId
  showConfirmDialog.value = true
}

const handleCollectMiddle = (playerId) => {
  const player = playersComposable.getPlayer(playerId)
  const halfBank = Math.floor(currentGame.value.bank / 2)
  confirmTitle.value = t('confirm.title')
  confirmMessage.value = t('confirm.collectMiddle', { name: player?.name, amount: halfBank })
  confirmButtonText.value = t('confirm.yesCollectedMiddle')
  pendingAction.value = 'middle'
  pendingPlayerId.value = playerId
  showConfirmDialog.value = true
}

const handleCollectBottom = (playerId) => {
  const player = playersComposable.getPlayer(playerId)
  const finalBank = currentGame.value.bank
  confirmTitle.value = t('confirm.title')
  confirmMessage.value = t('confirm.collectBottom', { name: player?.name, amount: finalBank })
  confirmButtonText.value = t('confirm.yesCollectedBottom')
  pendingAction.value = 'bottom'
  pendingPlayerId.value = playerId
  showConfirmDialog.value = true
}

const executeConfirmedAction = () => {
  if (!pendingAction.value || !pendingPlayerId.value) {
    showConfirmDialog.value = false
    return
  }

  const playerId = pendingPlayerId.value
  let success = false

  if (pendingAction.value === 'top') {
    success = collectTop(playerId, t)
  } else if (pendingAction.value === 'middle') {
    success = collectMiddle(playerId, t)
  } else if (pendingAction.value === 'bottom') {
    success = collectBottom(playerId, t)
  }
  
  // Rebuild bank history from events after action
  if (success) {
    rebuildBankHistoryFromEvents()
  }

  showConfirmDialog.value = false
  pendingAction.value = null
  pendingPlayerId.value = null
}

const cancelConfirmedAction = () => {
  showConfirmDialog.value = false
  pendingAction.value = null
  pendingPlayerId.value = null
}

const handleUndo = () => {
  if (undoLastAction()) {
    // Rebuild bank history from events after undo
    rebuildBankHistoryFromEvents()
  }
}

const handleUndoPlayer = (playerId) => {
  if (undoPlayerLastAction(playerId)) {
    // Rebuild bank history from events after undo
    rebuildBankHistoryFromEvents()
  }
}

const handleNewGame = () => {
  clearCurrentGame()
  bankHistory.value = []
}

const getWinnerName = () => {
  if (!currentGame.value) return ''
  const winner = currentGame.value.players.find(p => p.collectedRows.includes(ROW_TYPES.BOTTOM))
  if (winner) {
    const player = playersComposable.getPlayer(winner.playerId)
    return player?.name || 'Unknown'
  }
  return ''
}

const handleFullReset = () => {
  // Clear all data
  resetPlayers()
  resetGames()
  resetStatistics()
  
  // Clear localStorage
  storage.clearAll()
  
  // Reload page to reset all state
  window.location.reload()
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f0f0f0;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  flex: 1;
}

.app-main {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  gap: 20px;
  padding: 20px;
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
}

.sidebar,
.sidebar-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-content {
  min-width: 0;
}

.no-game {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.game-finished {
  background: white;
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-finished h2 {
  color: #4CAF50;
  margin-bottom: 16px;
  font-size: 28px;
}

.game-finished p {
  font-size: 18px;
  margin-bottom: 24px;
  color: #666;
}

.new-game-btn {
  padding: 12px 32px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.new-game-btn:hover {
  background: #45a049;
}

@media (max-width: 1400px) {
  .app-main {
    grid-template-columns: 280px 1fr 300px;
  }
}

@media (max-width: 1200px) {
  .app-main {
    grid-template-columns: 1fr;
  }

  .sidebar,
  .sidebar-right {
    order: 2;
  }

  .main-content {
    order: 1;
  }
}
</style>

