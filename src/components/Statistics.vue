<template>
  <div class="statistics">
    <h2>{{ t('statistics.title') }}</h2>
    
    <div class="stats-tabs">
      <button
        @click="activeTab = 'current'"
        :class="{ active: activeTab === 'current' }"
        class="tab-button"
      >
        {{ t('statistics.currentGame') }}
      </button>
      <button
        @click="activeTab = 'overall'"
        :class="{ active: activeTab === 'overall' }"
        class="tab-button"
      >
        {{ t('statistics.overallStats') }}
      </button>
      <button
        @click="activeTab = 'history'"
        :class="{ active: activeTab === 'history' }"
        class="tab-button"
      >
        {{ t('statistics.gameHistory') }}
      </button>
    </div>

    <!-- Current Game Stats -->
    <div v-if="activeTab === 'current' && currentGameStats" class="stats-content">
      <div class="stat-card">
        <h3>{{ t('statistics.currentGame') }}</h3>
        <div class="stat-item">
          <span>{{ t('game.startBet') }}:</span>
          <span>{{ formatBalance(currentGameStats.startBet) }}</span>
        </div>
        <div class="stat-item">
          <span>{{ t('bank.title') }}:</span>
          <span>{{ formatBalance(currentGameStats.bank) }}</span>
        </div>
        
        <h4>{{ t('statistics.players') }}:</h4>
        <div
          v-for="player in currentGameStats.players"
          :key="player.playerId"
          class="player-stat"
        >
          <div class="player-stat-header">
            <span>{{ player.name }}</span>
            <span>{{ t('player.contributions') }}: {{ formatBalance(player.contributions) }}</span>
          </div>
          <div class="collected-rows">
            <span v-if="player.collectedRows.includes(ROW_TYPES.TOP)" class="badge badge-top">{{ t('game.top') }}</span>
            <span v-if="player.collectedRows.includes(ROW_TYPES.MIDDLE)" class="badge badge-middle">{{ t('game.middle') }}</span>
            <span v-if="player.collectedRows.includes(ROW_TYPES.BOTTOM)" class="badge badge-bottom">{{ t('game.bottom') }}</span>
            <span v-if="player.collectedRows.length === 0" class="no-rows">{{ t('player.noCollectedRows') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Overall Stats -->
    <div v-if="activeTab === 'overall'" class="stats-content">
      <div class="stat-card">
        <h3>{{ t('statistics.overallStats') }}</h3>
        <div class="stat-item">
          <span>{{ t('statistics.totalGames') }}:</span>
          <span>{{ statistics.totalGames }}</span>
        </div>
        
        <h4>{{ t('statistics.playerStats') }}:</h4>
        <div
          v-for="player in players"
          :key="player.id"
          class="player-stat"
        >
          <div class="player-stat-header">
            <span>{{ player.name }}</span>
          </div>
          <div class="stat-details">
            <div class="stat-item">
              <span>{{ t('statistics.wins') }}:</span>
              <span>{{ getPlayerStats(player.id).wins }}</span>
            </div>
            <div class="stat-item">
              <span>{{ t('statistics.earnings') }}:</span>
              <span :class="{ negative: getPlayerStats(player.id).earnings < 0 }">
                {{ formatBalance(getPlayerStats(player.id).earnings) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game History -->
    <div v-if="activeTab === 'history'" class="stats-content">
      <div class="stat-card">
        <h3>{{ t('statistics.gameHistory') }}</h3>
        <div v-if="statistics.gameHistory.length === 0" class="no-history">
          {{ t('statistics.noCompletedGames') }}
        </div>
        <div
          v-for="game in statistics.gameHistory"
          :key="game.gameId"
          class="history-game-item"
          @click="openGameDetails(game)"
        >
          <span class="game-time">{{ formatTime(game.startDate) }}</span>
          <span class="game-winner" v-if="game.winner">
            {{ t('common.winner') }}: {{ game.winner.playerName }}
          </span>
        </div>
      </div>
    </div>

    <!-- Game Details Popup -->
    <div v-if="selectedGame" class="popup-overlay" @click="closeGameDetails">
      <div class="popup-content" @click.stop>
        <div class="popup-header">
          <h3>{{ t('statistics.gameDetails') }}</h3>
          <button class="close-btn" @click="closeGameDetails">×</button>
        </div>
        <div class="popup-body">
          <div class="popup-section">
            <div class="stat-item">
              <span>{{ t('statistics.gameDate') }}:</span>
              <span>{{ formatDate(selectedGame.startDate) }}</span>
            </div>
            <div class="stat-item" v-if="selectedGame.winner">
              <span>{{ t('common.winner') }}:</span>
              <span class="game-winner">{{ selectedGame.winner.playerName }}</span>
            </div>
            <div class="stat-item">
              <span>{{ t('game.startBet') }}:</span>
              <span>{{ formatBalance(selectedGame.startBet) }}</span>
            </div>
            <div class="stat-item">
              <span>{{ t('statistics.players') }}:</span>
              <span>{{ selectedGame.players.length }}</span>
            </div>
            <div class="stat-item" v-if="selectedGame.initialBank !== undefined">
              <span>{{ t('bank.initialBank') }}:</span>
              <span>{{ formatBalance(selectedGame.initialBank) }}</span>
            </div>
            <div class="stat-item" v-if="selectedGame.finalBank !== undefined">
              <span>{{ t('bank.finalBank') }}:</span>
              <span>{{ formatBalance(selectedGame.finalBank) }}</span>
            </div>
            <div class="stat-item" v-if="selectedGame.bankChange !== undefined">
              <span>{{ t('bank.bankChange') }}:</span>
              <span :class="{ 'positive': selectedGame.bankChange > 0, 'negative': selectedGame.bankChange < 0 }">
                {{ selectedGame.bankChange > 0 ? '+' : '' }}{{ formatBalance(selectedGame.bankChange) }}
              </span>
            </div>
          </div>
          <div class="popup-section">
            <h4>{{ t('statistics.players') }}:</h4>
            <div class="history-players">
              <div
                v-for="player in selectedGame.players"
                :key="player.playerId"
                class="history-player"
              >
                <span>{{ player.playerName }}</span>
                <div class="collected-rows">
                  <span v-if="player.collectedRows.includes(ROW_TYPES.TOP)" class="badge badge-top">{{ t('game.top') }}</span>
                  <span v-if="player.collectedRows.includes(ROW_TYPES.MIDDLE)" class="badge badge-middle">{{ t('game.middle') }}</span>
                  <span v-if="player.collectedRows.includes(ROW_TYPES.BOTTOM)" class="badge badge-bottom">{{ t('game.bottom') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFormatting } from '../composables/useFormatting'
import { useI18n } from '../composables/useI18n'
import { ROW_TYPES } from '../constants/game'

const { t } = useI18n()

const props = defineProps({
  currentGameStats: {
    type: Object,
    default: null
  },
  statistics: {
    type: Object,
    required: true
  },
  players: {
    type: Array,
    required: true
  },
  getPlayerStats: {
    type: Function,
    required: true
  }
})

const activeTab = ref('current')
const selectedGame = ref(null)
const { formatBalance, formatDate, formatTime } = useFormatting()

const openGameDetails = (game) => {
  selectedGame.value = game
}

const closeGameDetails = () => {
  selectedGame.value = null
}
</script>

<style scoped>
.statistics {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
}

.stats-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
}

.tab-button {
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  transition: all 0.2s;
}

.tab-button:hover {
  color: #333;
}

.tab-button.active {
  color: #2196F3;
  border-bottom-color: #2196F3;
}

.stats-content {
  margin-top: 20px;
}

.stat-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.stat-card h3 {
  margin-top: 0;
  color: #333;
}

.stat-card h4 {
  margin-top: 16px;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item span:first-child {
  color: #666;
}

.stat-item span:last-child {
  font-weight: 600;
  color: #333;
}

.stat-item span.negative {
  color: #f44336;
}

.stat-item span.positive {
  color: #4CAF50;
}

.player-stat {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.player-stat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.stat-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.collected-rows {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.badge-top {
  background: #4CAF50;
}

.badge-middle {
  background: #FF9800;
}

.badge-bottom {
  background: #2196F3;
}

.no-rows {
  color: #999;
  font-size: 12px;
  font-style: italic;
}

.no-history {
  text-align: center;
  padding: 40px;
  color: #999;
}

.history-game-item {
  margin-bottom: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.history-game-item:hover {
  background: #f5f5f5;
  border-color: #2196F3;
  transform: translateX(4px);
}

.game-time {
  font-weight: 600;
  color: #333;
}

.game-winner {
  color: #4CAF50;
  font-weight: 600;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.popup-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.popup-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #666;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.popup-body {
  padding: 20px;
}

.popup-section {
  margin-bottom: 24px;
}

.popup-section:last-child {
  margin-bottom: 0;
}

.popup-section h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #666;
  font-size: 14px;
}

.history-players {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>

