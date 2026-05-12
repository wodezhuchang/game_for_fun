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
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 140px;
}

.status-icon {
  font-size: 24px;
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
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.status-item.coins .status-value {
  color: #ffd700;
}

.status-item.cps .status-value {
  color: #38ef7d;
}

.status-item.total .status-value {
  color: #667eea;
}

.status-item.highscore .status-value {
  color: #ffa502;
}
</style>