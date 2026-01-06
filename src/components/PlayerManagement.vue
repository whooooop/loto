<template>
  <div class="player-management">
    <h2>{{ t('player.management') }}</h2>
    
    <div class="add-player-form">
      <input
        v-model="newPlayerName"
        type="text"
        :placeholder="t('player.playerName')"
        @keyup.enter="handleAddPlayer"
        class="name-input"
      />
      <input
        v-model.number="newPlayerBalance"
        type="number"
        :placeholder="t('player.initialBalance')"
        step="0.01"
        @keyup.enter="handleAddPlayer"
        class="balance-input-small"
      />
      <button @click="handleAddPlayer">{{ t('player.addPlayer') }}</button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <div class="players-list">
      <div
        v-for="player in players"
        :key="player.id"
        class="player-item"
      >
        <div class="player-info">
          <div class="player-name-wrapper">
            <input
              v-if="editingNames[player.id]"
              v-model="editNames[player.id]"
              type="text"
              @blur="savePlayerName(player.id)"
              @keyup.enter="savePlayerName(player.id)"
              @keyup.esc="cancelEditName(player.id)"
              class="name-edit-input"
              :ref="el => { if (el) nameInputRefs[player.id] = el }"
            />
            <span
              v-else
              class="player-name"
              @dblclick="startEditName(player.id)"
              :title="t('player.editNameHint')"
            >
              {{ player.name }}
            </span>
            <button
              v-if="!editingNames[player.id]"
              @click="startEditName(player.id)"
              class="edit-name-btn"
              :title="t('player.editName')"
            >
              ✏️
            </button>
          </div>
          <span class="player-balance" :class="{ negative: player.balance < 0 }">
            {{ formatBalance(player.balance) }}
          </span>
        </div>
        <div class="player-actions">
          <input
            v-model.number="editBalances[player.id]"
            type="number"
            placeholder="0.00"
            step="0.01"
            class="balance-input"
          />
          <button
            @click="updatePlayerBalance(player.id)"
            :disabled="!editBalances[player.id]"
          >
            {{ t('common.update') }}
          </button>
          <button @click="removePlayer(player.id)" class="delete-btn">
            {{ t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlayers } from '../composables/usePlayers'
import { useFormatting } from '../composables/useFormatting'
import { useI18n } from '../composables/useI18n'

const { players, addPlayer, removePlayer, updateBalance, updatePlayerName } = usePlayers()
const { formatBalance } = useFormatting()
const { t } = useI18n()

const newPlayerName = ref('')
const newPlayerBalance = ref(0)
const editBalances = ref({})
const editNames = ref({})
const editingNames = ref({})
const errorMessage = ref('')
const nameInputRefs = ref({})

const handleAddPlayer = () => {
  errorMessage.value = ''
  try {
    if (newPlayerName.value.trim()) {
      addPlayer(newPlayerName.value, newPlayerBalance.value, t)
      newPlayerName.value = ''
      newPlayerBalance.value = 0
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}

const updatePlayerBalance = (playerId) => {
  const amount = editBalances.value[playerId]
  if (amount !== undefined && amount !== null && amount !== '') {
    updateBalance(playerId, amount)
    editBalances.value[playerId] = null
  }
}

const startEditName = (playerId) => {
  const player = players.value.find(p => p.id === playerId)
  if (player) {
    editingNames.value[playerId] = true
    editNames.value[playerId] = player.name
    // Focus input on next tick
    setTimeout(() => {
      if (nameInputRefs.value[playerId]) {
        nameInputRefs.value[playerId].focus()
        nameInputRefs.value[playerId].select()
      }
    }, 0)
  }
}

const savePlayerName = (playerId) => {
  const newName = editNames.value[playerId]
  if (newName !== undefined && newName !== null) {
    try {
      updatePlayerName(playerId, newName, t)
      editingNames.value[playerId] = false
      editNames.value[playerId] = null
    } catch (error) {
      errorMessage.value = error.message
      // Keep editing mode on error
    }
  } else {
    cancelEditName(playerId)
  }
}

const cancelEditName = (playerId) => {
  editingNames.value[playerId] = false
  editNames.value[playerId] = null
}

onMounted(() => {
  players.value.forEach(player => {
    editBalances.value[player.id] = null
    editingNames.value[player.id] = false
  })
})
</script>

<style scoped>
.player-management {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: #333;
}

.add-player-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
}

.add-player-form .name-input {
  flex: 1;
  min-width: 150px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.add-player-form .balance-input-small {
  width: 120px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex-shrink: 0;
}

.add-player-form button {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.add-player-form button:hover {
  background: #45a049;
}

.error-message {
  width: 100%;
  padding: 8px;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 8px;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #f9f9f9;
}

.player-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.player-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.player-name {
  font-weight: 600;
  color: #333;
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.player-name:hover {
  background: #f0f0f0;
}

.edit-name-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-name-btn:hover {
  opacity: 1;
}

.name-edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 2px solid #2196F3;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  min-width: 100px;
}

.player-balance {
  font-size: 18px;
  font-weight: 600;
  color: #4CAF50;
}

.player-balance.negative {
  color: #f44336;
}

.player-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.balance-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1 1;
  min-width: 0;
}

.player-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.player-actions button:not(.delete-btn) {
  background: #2196F3;
  color: white;
}

.player-actions button:not(.delete-btn):hover {
  background: #0b7dda;
}

.player-actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.delete-btn:hover {
  background: #da190b;
}
</style>


