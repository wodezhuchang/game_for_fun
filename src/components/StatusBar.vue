<script setup lang="ts">
import { useChickenGameStore } from '../stores/chickenGameStore'

const gameStore = useChickenGameStore()
</script>

<template>
  <div class="status-bar">
    <div class="status-item coins">
      <span class="status-icon">💰</span>
      <div class="status-content">
        <span class="status-label">金币</span>
        <span class="status-value">{{ gameStore.coins.toLocaleString() }}</span>
      </div>
    </div>

    <div class="status-item cps">
      <span class="status-icon">⚡</span>
      <div class="status-content">
        <span class="status-label">每秒产出</span>
        <span class="status-value">{{ gameStore.coinPerSecond }}/秒</span>
      </div>
    </div>

    <div class="status-item total">
      <span class="status-icon">📊</span>
      <div class="status-content">
        <span class="status-label">总收入</span>
        <span class="status-value">{{ gameStore.totalEarnings.toLocaleString() }}</span>
      </div>
    </div>

    <div class="status-item highscore">
      <span class="status-icon">🏆</span>
      <div class="status-content">
        <span class="status-label">最高分</span>
        <span class="status-value">{{ gameStore.highScore.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.85) 0%, rgba(20, 20, 40, 0.9) 100%);
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  min-width: 150px;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}

.status-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, transparent 50%);
  pointer-events: none;
}

.status-icon {
  font-size: 26px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.status-content {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.status-value {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.status-item.coins .status-value {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.status-item.cps .status-value {
  color: #38ef7d;
  text-shadow: 0 0 10px rgba(56, 239, 125, 0.3);
}

.status-item.total .status-value {
  color: #667eea;
  text-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
}

.status-item.highscore .status-value {
  color: #ffa502;
  text-shadow: 0 0 10px rgba(255, 165, 2, 0.3);
}
</style>