<script setup lang="ts">
import { useChickenGameStore } from '../stores/chickenGameStore'
import { CHICKEN_CONFIG, GRID_SIZE } from '../data/gameConfig'

const gameStore = useChickenGameStore()

function isSelected(row: number, col: number): boolean {
  return gameStore.selectedCell?.row === row && gameStore.selectedCell?.col === col
}

function getChickenInfo(level: number) {
  return CHICKEN_CONFIG[level]
}

function getLevelColor(level: number): string {
  const colors = [
    '#667eea',
    '#f093fb',
    '#11998e',
    '#38ef7d',
    '#eb3349',
    '#ffa502',
    '#ffd700',
    '#4facfe',
    '#00f2fe',
    '#f45c43',
    '#667eea',
    '#f093fb',
    '#11998e',
    '#ffd700',
    '#ff6b6b'
  ]
  const index = (level - 1) % colors.length
  return colors[index] ?? '#667eea'
}
</script>

<template>
  <div class="game-grid">
    <div class="grid-container">
      <div
        v-for="(row, rowIndex) in gameStore.grid"
        :key="rowIndex"
        class="grid-row"
      >
        <div
          v-for="(chicken, colIndex) in row"
          :key="colIndex"
          :class="['grid-cell', { 'has-chicken': chicken, 'selected': isSelected(rowIndex, colIndex) }]"
          @click="gameStore.selectCell(rowIndex, colIndex)"
          @contextmenu.prevent="gameStore.sellChicken(rowIndex, colIndex)"
          @mousedown.prevent
        >
          <div v-if="chicken" class="chicken-content">
            <span class="chicken-emoji">{{ chicken.emoji }}</span>
            <span class="chicken-level">Lv.{{ chicken.level }}</span>
            <div v-if="getChickenInfo(chicken.level)" class="chicken-tooltip">
              <div class="tooltip-name">{{ getChickenInfo(chicken.level)!.name }}</div>
              <div class="tooltip-rate">💰 {{ getChickenInfo(chicken.level)!.coinPerSecond }}/秒</div>
            </div>
            <div 
              class="chicken-glow" 
              :style="{ background: `radial-gradient(circle, ${getLevelColor(chicken.level)}40 0%, transparent 70%)` }"
            ></div>
          </div>
          <div v-else class="empty-cell">
            <span class="empty-hint">+</span>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-hint">
      <p>点击选择鸡 → 点击目标位置移动/合成</p>
      <p>右键点击出售鸡</p>
    </div>
  </div>
</template>

<style scoped>
.game-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.grid-row {
  display: flex;
  gap: 10px;
}

.grid-cell {
  width: 75px;
  height: 75px;
  border-radius: 14px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.grid-cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.grid-cell:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.08);
  transform: scale(1.02);
}

.grid-cell.selected {
  border-color: #ffd700;
  box-shadow: 
    0 0 0 3px rgba(255, 215, 0, 0.3),
    0 0 30px rgba(255, 215, 0, 0.4),
    inset 0 0 20px rgba(255, 215, 0, 0.1);
  transform: scale(1.08);
  background: rgba(255, 215, 0, 0.1);
}

.grid-cell.has-chicken {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%);
}

.grid-cell.has-chicken:hover {
  border-color: rgba(255, 255, 255, 0.6);
}

.chicken-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chicken-emoji {
  font-size: 36px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.15s ease;
}

.grid-cell.has-chicken:hover .chicken-emoji {
  transform: scale(1.15);
}

.grid-cell.selected .chicken-emoji {
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chicken-level {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 2px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.chicken-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.grid-cell.has-chicken:hover .chicken-glow {
  opacity: 1;
}

.chicken-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  padding: 10px 14px;
  border-radius: 10px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 100;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.grid-cell.has-chicken:hover .chicken-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}

.tooltip-name {
  font-size: 13px;
  font-weight: bold;
  color: white;
}

.tooltip-rate {
  font-size: 12px;
  color: #ffd700;
  margin-top: 4px;
}

.empty-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-hint {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.15);
  font-weight: bold;
}

.grid-hint {
  margin-top: 20px;
  text-align: center;
}

.grid-hint p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 6px 0;
}
</style>