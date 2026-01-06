<template>
  <div class="game-log">
    <h3>{{ t('log.eventLog') }}</h3>
    <div class="log-list">
      <div
        v-for="(event, index) in eventLog"
        :key="index"
        class="log-item"
        :class="`log-${event.type}`"
      >
        <span class="log-time">{{ formatTime(event.timestamp) }}</span>
        <span class="log-description">{{ event.description }}</span>
      </div>
      <div v-if="eventLog.length === 0" class="log-empty">
        {{ t('log.noEvents') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const props = defineProps({
  eventLog: {
    type: Array,
    default: () => []
  }
})

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.game-log {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
}

.log-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.log-start {
  background: #e3f2fd;
  border-left: 3px solid #2196F3;
}

.log-top {
  background: #e8f5e9;
  border-left: 3px solid #4CAF50;
}

.log-middle {
  background: #fff3e0;
  border-left: 3px solid #FF9800;
}

.log-bottom {
  background: #f3e5f5;
  border-left: 3px solid #9c27b0;
}

.log-time {
  color: #666;
  font-weight: 600;
  min-width: 70px;
  font-size: 12px;
}

.log-description {
  color: #333;
  flex: 1;
}

.log-empty {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}
</style>


