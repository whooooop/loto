<template>
  <div class="players-balance">
    <h3>{{ t('balance.title') }}</h3>
    <div class="balance-list">
      <div
        v-for="player in players"
        :key="player.id"
        class="balance-item"
        :class="{ negative: player.balance < 0 }"
      >
        <span class="player-name">{{ player.name }}</span>
        <span class="balance-amount">{{ formatBalance(player.balance) }}</span>
      </div>
      <div v-if="players.length === 0" class="no-players">
        {{ t('balance.noPlayers') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFormatting } from '../composables/useFormatting'
import { useI18n } from '../composables/useI18n'

const { formatBalance } = useFormatting()
const { t } = useI18n()

const props = defineProps({
  players: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.players-balance {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
}

.balance-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  border-left: 3px solid #4CAF50;
}

.balance-item.negative {
  border-left-color: #f44336;
}

.player-name {
  font-weight: 600;
  color: #333;
}

.balance-amount {
  font-weight: 700;
  color: #4CAF50;
  font-size: 16px;
}

.balance-item.negative .balance-amount {
  color: #f44336;
}

.no-players {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}
</style>


