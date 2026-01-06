<template>
  <div class="game-board">
    <div class="board-header">
      <h2>{{ t('game.gameBoard') }}</h2>
      <button
        v-if="currentGame.status === GAME_STATUS.ACTIVE && canUndo"
        @click="handleUndo"
        class="undo-btn"
        :title="t('game.undoLastAction')"
      >
        ↶ {{ t('game.undoLastAction') }}
      </button>
      <div v-else-if="currentGame.status === GAME_STATUS.ACTIVE" class="no-undo-hint">
        {{ t('game.noActionsToUndo') }}
      </div>
    </div>
    
    <div class="cards-container">
      <div
        v-for="gamePlayer in currentGame.players"
        :key="gamePlayer.playerId"
        class="player-card-wrapper"
      >
        <LotoCard
          :card="gamePlayer.card"
          :collected-rows="gamePlayer.collectedRows"
          :player-name="getPlayerName(gamePlayer.playerId)"
          :show-actions="currentGame.status === GAME_STATUS.ACTIVE"
          :can-collect-top="currentGame.status === GAME_STATUS.ACTIVE"
          :can-collect-middle="currentGame.status === GAME_STATUS.ACTIVE"
          :can-collect-bottom="currentGame.status === GAME_STATUS.ACTIVE && !gamePlayer.collectedRows.includes(ROW_TYPES.BOTTOM)"
          :can-undo="canUndoPlayerAction(gamePlayer.playerId) && getLastActionType(gamePlayer.playerId) !== null"
          @collect-top="handleCollectTop(gamePlayer.playerId)"
          @collect-middle="handleCollectMiddle(gamePlayer.playerId)"
          @collect-bottom="handleCollectBottom(gamePlayer.playerId)"
          @undo="handleUndoPlayer(gamePlayer.playerId)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import LotoCard from './LotoCard.vue'
import { GAME_STATUS, ROW_TYPES } from '../constants/game'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const props = defineProps({
  currentGame: {
    type: Object,
    required: true
  },
  players: {
    type: Array,
    required: true
  },
  onCollectTop: {
    type: Function,
    required: true
  },
  onCollectMiddle: {
    type: Function,
    required: true
  },
  onCollectBottom: {
    type: Function,
    required: true
  },
  onUndo: {
    type: Function,
    required: true
  },
  canUndo: {
    type: Boolean,
    default: false
  },
  onUndoPlayer: {
    type: Function,
    required: true
  },
  canUndoPlayerAction: {
    type: Function,
    required: true
  }
})

const getPlayerName = (playerId) => {
  const player = props.players.find(p => p.id === playerId)
  return player ? player.name : 'Unknown'
}

const handleCollectTop = (playerId) => {
  props.onCollectTop(playerId)
}

const handleCollectMiddle = (playerId) => {
  props.onCollectMiddle(playerId)
}

const handleCollectBottom = (playerId) => {
  props.onCollectBottom(playerId)
}

const handleUndo = () => {
  props.onUndo()
}

const handleUndoPlayer = (playerId) => {
  props.onUndoPlayer(playerId)
}

const getLastActionType = (playerId) => {
  if (!props.currentGame.eventLog || props.currentGame.eventLog.length === 0) {
    return null
  }
  const lastEvent = props.currentGame.eventLog[props.currentGame.eventLog.length - 1]
  if (lastEvent.playerId === playerId) {
    return lastEvent.type
  }
  return null
}
</script>

<style scoped>
.game-board {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: #333;
}

.undo-btn {
  padding: 10px 20px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.undo-btn:hover {
  background: #f57c00;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.no-undo-hint {
  padding: 8px 12px;
  color: #999;
  font-size: 12px;
  font-style: italic;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.player-card-wrapper {
  display: flex;
  flex-direction: column;
}
</style>

