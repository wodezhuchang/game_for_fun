<script setup lang="ts">
import { ref } from 'vue'
import { useChickenGameStore } from '../stores/chickenGameStore'

const gameStore = useChickenGameStore()
const importResult = ref<{ success: boolean; message: string } | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleExport() {
  const data = gameStore.exportProgress()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = new Date().toISOString().slice(0, 10)
  a.download = `chicken_game_${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function handleImportClick() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    importResult.value = gameStore.importProgress(content)
    
    setTimeout(() => {
      importResult.value = null
    }, 3000)
  }
  reader.readAsText(file)
  target.value = ''
}

function handleReset() {
  if (confirm('确定要重置游戏吗？所有鸡和金币将会丢失，但最高分保留。')) {
    gameStore.resetGame()
  }
}

function handleClear() {
  if (confirm('确定要清除所有进度吗？包括最高分！')) {
    gameStore.clearProgress()
  }
}
</script>

<template>
  <div class="control-panel">
    <div class="control-group">
      <button class="btn btn-export" @click="handleExport">📥 导出进度</button>
      <button class="btn btn-import" @click="handleImportClick">📤 导入进度</button>
      <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        @change="handleFileSelect"
        class="file-input"
      />
    </div>

    <div class="control-group">
      <button class="btn btn-warning" @click="handleReset">🔄 重置游戏</button>
      <button class="btn btn-danger" @click="handleClear">🗑️ 清除进度</button>
    </div>

    <div
      v-if="importResult"
      :class="['import-result', importResult.success ? 'success' : 'error']"
    >
      {{ importResult.message }}
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-export {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-import {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

.btn-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.file-input {
  display: none;
}

.import-result {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  animation: fadeIn 0.3s ease;
}

.import-result.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.import-result.error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>