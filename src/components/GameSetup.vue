<template>
  <div class="game-setup">
    <h2>{{ t('game.setup') }}</h2>
    
    <div class="setup-form">
      <div class="form-group">
        <label>{{ t('game.startBet') }}:</label>
        <input
          v-model.number="startBet"
          type="number"
          min="0"
          step="0.01"
          :placeholder="t('game.enterAmount')"
        />
      </div>

      <div class="form-group">
        <div class="players-label-row">
          <label>{{ t('game.selectPlayers') }}:</label>
          <button
            @click="selectAllPlayers"
            class="select-all-btn"
            :disabled="players.length === 0"
          >
            {{ t('game.selectAll') }}
          </button>
        </div>
        <div class="players-checkboxes">
          <label
            v-for="player in players"
            :key="player.id"
            class="checkbox-label"
          >
            <input
              type="checkbox"
              :value="player.id"
              v-model="selectedPlayers"
            />
            <span>{{ player.name }} ({{ formatBalance(player.balance) }})</span>
          </label>
        </div>
      </div>

      <button
        @click="handleCreateGame"
        :disabled="!canCreateGame"
        class="create-button"
      >
        {{ t('game.startGame') }}
      </button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlayers } from '../composables/usePlayers'
import { useFormatting } from '../composables/useFormatting'
import { validation } from '../utils/validation'
import { useI18n } from '../composables/useI18n'

const props = defineProps({
  onCreateGame: {
    type: Function,
    required: true
  }
})

const { players } = usePlayers()
const { formatBalance } = useFormatting()
const { t } = useI18n()

const startBet = ref(0)
const selectedPlayers = ref([])
const errorMessage = ref('')

const canCreateGame = computed(() => {
  return startBet.value > 0 && selectedPlayers.value.length >= 2
})

const selectAllPlayers = () => {
  if (players.value.length > 0) {
    selectedPlayers.value = players.value.map(p => p.id)
  }
}

const handleCreateGame = () => {
  errorMessage.value = ''
  
  // Validate start bet
  const betValidation = validation.validateStartBet(startBet.value, t)
  if (!betValidation.valid) {
    errorMessage.value = t(betValidation.errorKey)
    return
  }
  
  // Validate player selection
  const playersValidation = validation.validatePlayerSelection(selectedPlayers.value, t)
  if (!playersValidation.valid) {
    errorMessage.value = t(playersValidation.errorKey)
    return
  }
  
  if (canCreateGame.value) {
    props.onCreateGame(selectedPlayers.value, startBet.value)
    startBet.value = 0
    selectedPlayers.value = []
    errorMessage.value = ''
  }
}
</script>

<style scoped>
.game-setup {
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
}

.setup-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.players-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select-all-btn {
  padding: 6px 12px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.select-all-btn:hover:not(:disabled) {
  background: #0b7dda;
}

.select-all-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-group input[type="number"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.players-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label span {
  color: #333;
}

.create-button {
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.create-button:hover:not(:disabled) {
  background: #45a049;
}

.create-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  padding: 8px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 8px;
}
</style>


