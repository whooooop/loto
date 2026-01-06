<template>
  <div class="loto-card">
    <div class="card-header">
      <h3>{{ playerName }}</h3>
      <div class="collected-badges">
        <span v-if="topCount > 0" class="badge badge-top">
          {{ t('game.top') }}
          <span v-if="topCount > 1" class="badge-count">{{ topCount }}</span>
        </span>
        <span v-if="middleCount > 0" class="badge badge-middle">
          {{ t('game.middle') }}
          <span v-if="middleCount > 1" class="badge-count">{{ middleCount }}</span>
        </span>
        <span v-if="bottomCount > 0" class="badge badge-bottom">
          {{ t('game.bottom') }}
          <span v-if="bottomCount > 1" class="badge-count">{{ bottomCount }}</span>
        </span>
      </div>
    </div>
    
    <div class="card-actions" v-if="showActions">
      <button
        v-if="canCollectTop"
        @click="$emit('collectTop')"
        class="action-btn top-btn"
        :title="t('game.collectedTop')"
      >
        <svg class="lines-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="0" y="0" width="100" height="33.33" fill="currentColor" class="bar bar-top filled"/>
          <rect x="0" y="0" width="100" height="33.33" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-top-border"/>
          <rect x="0" y="33.33" width="100" height="33.33" fill="#888888" class="bar bar-middle"/>
          <rect x="0" y="33.33" width="100" height="33.33" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-middle-border"/>
          <rect x="0" y="66.66" width="100" height="33.34" fill="#888888" class="bar bar-bottom"/>
          <rect x="0" y="66.66" width="100" height="33.34" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-bottom-border"/>
        </svg>
        <span class="text">{{ t('game.collectedTop') }}</span>
      </button>
      <button
        v-if="canCollectMiddle"
        @click="$emit('collectMiddle')"
        class="action-btn middle-btn"
        :title="t('game.collectedMiddle')"
      >
        <svg class="lines-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="0" y="0" width="100" height="33.33" fill="#888888" class="bar bar-top"/>
          <rect x="0" y="0" width="100" height="33.33" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-top-border"/>
          <rect x="0" y="33.33" width="100" height="33.33" fill="currentColor" class="bar bar-middle filled"/>
          <rect x="0" y="33.33" width="100" height="33.33" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-middle-border"/>
          <rect x="0" y="66.66" width="100" height="33.34" fill="#888888" class="bar bar-bottom"/>
          <rect x="0" y="66.66" width="100" height="33.34" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-bottom-border"/>
        </svg>
        <span class="text">{{ t('game.collectedMiddle') }}</span>
      </button>
      <button
        v-if="canCollectBottom"
        @click="$emit('collectBottom')"
        class="action-btn bottom-btn"
        :title="t('game.collectedBottom')"
      >
        <svg class="lines-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <rect x="0" y="0" width="100" height="33.33" fill="#888888" class="bar bar-top"/>
          <rect x="0" y="0" width="100" height="33.33" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-top-border"/>
          <rect x="0" y="33.33" width="100" height="33.33" fill="#888888" class="bar bar-middle"/>
          <rect x="0" y="33.33" width="100" height="33.33" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-middle-border"/>
          <rect x="0" y="66.66" width="100" height="33.34" fill="currentColor" class="bar bar-bottom filled"/>
          <rect x="0" y="66.66" width="100" height="33.34" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2" vector-effect="non-scaling-stroke" class="bar-border bar-bottom-border"/>
        </svg>
        <span class="text">{{ t('game.collectedBottom') }}</span>
      </button>
      <button
        v-if="canUndo"
        @click="$emit('undo')"
        class="action-btn undo-btn"
        :title="t('game.undoLastAction')"
      >
        <svg class="undo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <path d="M3 7V3L9 9L3 15V11C3 14.31 5.69 17 9 17H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text">{{ t('game.undoLastAction') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ROW_TYPES } from '../constants/game'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const props = defineProps({
  card: {
    type: Array,
    required: true
  },
  collectedRows: {
    type: Array,
    default: () => []
  },
  playerName: {
    type: String,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  canCollectTop: {
    type: Boolean,
    default: false
  },
  canCollectMiddle: {
    type: Boolean,
    default: false
  },
  canCollectBottom: {
    type: Boolean,
    default: false
  },
  canUndo: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['collectTop', 'collectMiddle', 'collectBottom', 'undo'])

// Count how many times each row was collected
const topCount = computed(() => {
  return props.collectedRows.filter(row => row === ROW_TYPES.TOP).length
})

const middleCount = computed(() => {
  return props.collectedRows.filter(row => row === ROW_TYPES.MIDDLE).length
})

const bottomCount = computed(() => {
  return props.collectedRows.filter(row => row === ROW_TYPES.BOTTOM).length
})
</script>

<style scoped>
.loto-card {
  background: white;
  border: 2px solid #333;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.loto-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.collected-badges {
  display: flex;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.badge-count {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  margin-left: 2px;
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

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  min-width: 50px;
  padding: 0;
  margin: 0;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
  overflow: hidden;
  min-height: 44px;
  box-sizing: border-box;
}

.action-btn svg {
  width: 100%;
  height: 100%;
  display: block;
  transition: opacity 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
}

.lines-icon {
  width: 100%;
  height: 100%;
}

.undo-icon {
  width: 100%;
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.lines-icon .bar {
  transition: all 0.3s ease;
}

.lines-icon .bar.filled {
  opacity: 1;
}

.lines-icon .bar:not(.filled) {
  opacity: 1;
}

.lines-icon .bar-border {
  opacity: 1;
}

.undo-icon {
  width: 100%;
  height: 100%;
}

.action-btn .text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 600;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  text-align: center;
  white-space: normal;
  word-wrap: break-word;
  max-width: 90%;
  z-index: 10;
}

.action-btn:hover svg {
  opacity: 0;
}

.action-btn:hover .text {
  opacity: 1;
  transform: translate(-50%, -50%);
}

.top-btn {
  background: #4CAF50;
}

.top-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.middle-btn {
  background: #FF9800;
}

.middle-btn:hover {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}

.bottom-btn {
  background: #2196F3;
}

.bottom-btn:hover {
  background: #0b7dda;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.undo-btn {
  background: #f44336;
}

.undo-btn:hover {
  background: #da190b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
}
</style>

