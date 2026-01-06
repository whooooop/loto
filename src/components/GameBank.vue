<template>
  <div class="game-bank">
    <h2>{{ t('bank.title') }}</h2>
    <div class="bank-amount">
      <span class="amount-label">{{ t('bank.currentBank') }}:</span>
      <span class="amount-value">{{ formatBalance(bank) }}</span>
    </div>
    
    <div v-if="history.length > 0" class="bank-history">
      <h3>{{ t('bank.historyTitle') }}</h3>
      <div class="history-list">
        <div
          v-for="(entry, index) in history"
          :key="index"
          class="history-item"
          :class="{
            'history-contribution': entry.type === 'contribution',
            'history-withdrawal': entry.type === 'withdrawal'
          }"
        >
          <div class="history-info">
            <span class="history-player" v-if="entry.playerName">{{ entry.playerName }}</span>
            <span class="history-description">{{ entry.description }}</span>
          </div>
          <span class="history-amount" :class="{ negative: entry.amount < 0, positive: entry.amount > 0 }">
            {{ entry.amount > 0 ? '+' : '' }}{{ formatBalance(entry.amount) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFormatting } from '../composables/useFormatting'
import { useI18n } from '../composables/useI18n'

const { formatBalance } = useFormatting()
const { t } = useI18n()

const props = defineProps({
  bank: {
    type: Number,
    default: 0
  },
  history: {
    type: Array,
    default: () => []
  }
})

</script>

<style scoped>
.game-bank {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
}

.bank-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 20px;
}

.amount-label {
  font-size: 18px;
  color: white;
  font-weight: 500;
}

.amount-value {
  font-size: 32px;
  color: white;
  font-weight: 700;
}

.bank-history {
  margin-top: 20px;
}

.bank-history h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #666;
  font-size: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 14px;
  border-left: 4px solid transparent;
  transition: all 0.2s;
}

.history-item:hover {
  background: #eeeeee;
}

.history-contribution {
  border-left-color: #4CAF50;
}

.history-withdrawal {
  border-left-color: #f44336;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.history-player {
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.history-description {
  color: #666;
  font-size: 12px;
}

.history-amount {
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  margin-left: 12px;
}

.history-amount.positive {
  color: #4CAF50;
}

.history-amount.negative {
  color: #f44336;
}
</style>


