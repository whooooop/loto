<template>
  <div class="reset-data">
    <button @click="showConfirm = true" class="reset-button">
      {{ t('reset.fullReset') }}
    </button>
    
    <div v-if="showConfirm" class="confirm-dialog">
      <div class="confirm-content">
        <h3>{{ t('reset.confirmReset') }}</h3>
        <p>{{ t('reset.confirmMessage') }}</p>
        <p class="warning">{{ t('reset.warning') }}</p>
        <div class="confirm-actions">
          <button @click="handleReset" class="confirm-btn confirm-yes">
            {{ t('reset.yesReset') }}
          </button>
          <button @click="showConfirm = false" class="confirm-btn confirm-no">
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const emit = defineEmits(['reset'])

const showConfirm = ref(false)

const handleReset = () => {
  emit('reset')
  showConfirm.value = false
}
</script>

<style scoped>
.reset-data {
  position: relative;
}

.reset-button {
  width: 100%;
  padding: 12px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.reset-button:hover {
  background: #da190b;
}

.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.confirm-content h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.confirm-content p {
  margin: 8px 0;
  color: #666;
}

.warning {
  color: #f44336 !important;
  font-weight: 600;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.confirm-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-yes {
  background: #f44336;
  color: white;
}

.confirm-yes:hover {
  background: #da190b;
}

.confirm-no {
  background: #e0e0e0;
  color: #333;
}

.confirm-no:hover {
  background: #d0d0d0;
}
</style>


