<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const clickCount = ref(0)
const combo = ref(0)
const showLevelUp = ref(false)
const importResult = ref<{ success: boolean; message: string } | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

function handleClick() {
  clickCount.value++
  combo.value++
  
  const bonus = Math.min(combo.value, 10)
  const points = 1 * bonus
  gameStore.addScore(points)
  
  if (combo.value >= 5) {
    gameStore.addCoins(1)
  }
}

function resetCombo() {
  combo.value = 0
}

setInterval(resetCombo, 2000)

function handleReset() {
  if (confirm('确定要重置游戏进度吗？分数和金币将会丢失，但最高分保留。')) {
    gameStore.resetGame()
    clickCount.value = 0
  }
}

function handleClear() {
  if (confirm('确定要清除所有进度吗？包括最高分！')) {
    gameStore.clearProgress()
    clickCount.value = 0
  }
}

function handleExport() {
  const data = gameStore.exportProgress()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = new Date().toISOString().slice(0, 10)
  a.download = `game_progress_${date}.json`
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
</script>

<template>
  <div class="game-container">
    <div class="stats-panel">
      <div class="stat">
        <span class="label">分数</span>
        <span class="value">{{ gameStore.progress.score }}</span>
      </div>
      <div class="stat">
        <span class="label">等级</span>
        <span class="value level">{{ gameStore.progress.level }}</span>
      </div>
      <div class="stat">
        <span class="label">金币</span>
        <span class="value coins">💰 {{ gameStore.progress.coins }}</span>
      </div>
      <div class="stat">
        <span class="label">最高分</span>
        <span class="value high">{{ gameStore.progress.highScore }}</span>
      </div>
    </div>

    <div class="combo-display" v-if="combo >= 2">
      🔥 {{ combo }}x COMBO!
    </div>

    <div class="click-area" @click="handleClick">
      <div class="click-target">
        <span class="click-text">点击我!</span>
        <span class="click-count">{{ clickCount }}</span>
      </div>
    </div>

    <div class="buttons-panel">
      <button class="btn btn-warning" @click="handleReset">重置游戏</button>
      <button class="btn btn-danger" @click="handleClear">清除进度</button>
    </div>

    <div class="import-export-panel">
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

    <div
      v-if="importResult"
      :class="['import-result', importResult.success ? 'success' : 'error']"
    >
      {{ importResult.message }}
    </div>

    <div class="tips">
      <p>💡 连续点击获得连击加成！5次以上连击获得金币奖励</p>
      <p>📊 每100分升级，升级获得金币奖励</p>
      <p>💾 进度自动保存到本地存储</p>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.stat .label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 5px;
}

.stat .value {
  display: block;
  font-size: 24px;
  font-weight: bold;
}

.stat .value.level {
  color: #ffd700;
}

.stat .value.coins {
  color: #ffd700;
}

.stat .value.high {
  color: #ff6b6b;
}

.combo-display {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 20px;
  animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.click-area {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 20px;
  padding: 40px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 8px 32px rgba(245, 87, 108, 0.4);
  margin-bottom: 20px;
}

.click-area:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(245, 87, 108, 0.6);
}

.click-area:active {
  transform: scale(0.98);
}

.click-target {
  text-align: center;
  color: white;
}

.click-text {
  display: block;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.click-count {
  display: block;
  font-size: 48px;
  font-weight: bold;
  opacity: 0.8;
}

.buttons-panel {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.btn-export {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-import {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

.import-export-panel {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 15px;
}

.file-input {
  display: none;
}

.import-result {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 15px;
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

.tips {
  background: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.tips p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}
</style>