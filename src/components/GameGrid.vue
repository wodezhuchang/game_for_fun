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
        >
          <div v-if="chicken" class="chicken-content">
            <span class="chicken-emoji">{{ chicken.emoji }}</span>
            <span class="chicken-level">Lv.{{ chicken.level }}</span>
            <div v-if="getChickenInfo(chicken.level)" class="chicken-tooltip">
              <div class="tooltip-name">{{ getChickenInfo(chicken.level)!.name }}</div>
              <div class="tooltip-rate">💰 {{ getChickenInfo(chicken.level)!.coinPerSecond }}/秒</div>
            </div>
          </div>
          <div v-else class="empty-cell">
            <span class="empty-hint">+</span>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-hint">
      <p>点击选择鸡 → 点击目标位置移动</p>
      <p>右键点击出售鸡</p>
    </div>
  </div>
</template>

<style scoped>
.game-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.grid-row {
  display: flex;
  gap: 8px;
}

.grid-cell {
  width: 70px;
  height: 70px;
  border-radius: 12px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.grid-cell:hover {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.05);
}

.grid-cell.selected {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  transform: scale(1.05);
}

.grid-cell.has-chicken {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
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
  font-size: 32px;
  line-height: 1;
}

.chicken-level {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
  font-weight: bold;
}

.chicken-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 100;
}

.grid-cell.has-chicken:hover .chicken-tooltip {
  opacity: 1;
  visibility: visible;
}

.tooltip-name {
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.tooltip-rate {
  font-size: 11px;
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
  font-size: 24px;
  color: rgba(255, 255, 255, 0.2);
}

.grid-hint {
  margin-top: 16px;
  text-align: center;
}

.grid-hint p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0;
}
</style>