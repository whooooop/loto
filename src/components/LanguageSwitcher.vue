<template>
  <div class="language-switcher">
    <select v-model="selectedLocale" @change="handleLocaleChange" class="locale-select">
      <option
        v-for="locale in availableLocales"
        :key="locale.code"
        :value="locale.code"
      >
        {{ locale.flag }} {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n'

const { locale, setLocale, availableLocales } = useI18n()
const selectedLocale = ref(locale.value)

watch(locale, (newLocale) => {
  selectedLocale.value = newLocale
})

const handleLocaleChange = () => {
  setLocale(selectedLocale.value)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
}

.locale-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.locale-select:hover {
  border-color: #667eea;
}

.locale-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
</style>


