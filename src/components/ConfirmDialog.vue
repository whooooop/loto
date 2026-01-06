<template>
  <div v-if="show" class="confirm-dialog-overlay" @click.self="handleCancel">
    <div class="confirm-dialog">
      <div class="confirm-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="confirm-actions">
          <button @click="handleConfirm" class="confirm-btn confirm-yes">
            {{ confirmText }}
          </button>
          <button @click="handleCancel" class="confirm-btn confirm-no">
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.confirm-dialog-overlay {
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

.confirm-dialog {
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
  background: #2196F3;
  color: white;
}

.confirm-yes:hover {
  background: #0b7dda;
}

.confirm-no {
  background: #e0e0e0;
  color: #333;
}

.confirm-no:hover {
  background: #d0d0d0;
}
</style>


