<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useChickenGameStore } from '../stores/chickenGameStore'
import StatusBar from './StatusBar.vue'
import GameGrid from './GameGrid.vue'
import ShopPanel from './ShopPanel.vue'
import ControlPanel from './ControlPanel.vue'

const gameStore = useChickenGameStore()

let coinInterval: number | null = null

onMounted(() => {
  coinInterval = window.setInterval(() => {
    if (gameStore.coinPerSecond > 0) {
      gameStore.addCoins(gameStore.coinPerSecond)
    }
  }, 1000)
})

onUnmounted(() => {
  if (coinInterval) {
    clearInterval(coinInterval)
  }
})
</script>

<template>
  <div class="game-wrapper">
    <header class="game-header">
      <h1>🐔 合成小鸡</h1>
      <p class="subtitle">合成相同等级的小鸡，解锁更高级的鸡！</p>
    </header>

    <StatusBar />

    <div class="game-main">
      <div class="game-left">
        <GameGrid />
        
        <div v-if="gameStore.showNotification" 
             :class="['notification', gameStore.showNotification.type]">
          {{ gameStore.showNotification.message }}
        </div>
      </div>

      <div class="game-right">
        <ShopPanel />
      </div>
    </div>

    <ControlPanel />

    <footer class="game-footer">
      <p>💡 提示：低级鸡性价比最高，先购买低级鸡积累金币，再逐步合成高级鸡！</p>
    </footer>
  </div>
</template>

<style scoped>
.game-wrapper {
  min-height: 100vh;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.game-header {
  text-align: center;
  margin-bottom: 24px;
}

.game-header h1 {
  font-size: 36px;
  color: white;
  margin: 0;
  text-shadow: 0 2px 20px rgba(255, 215, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-top: 8px;
}

.game-main {
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.game-left {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-right {
  width: 320px;
}

.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 16px;
  z-index: 1000;
  animation: slideDown 0.3s ease;
}

.notification.success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.game-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.game-footer p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

@media (max-width: 768px) {
  .game-main {
    flex-direction: column;
    align-items: center;
  }
  
  .game-right {
    width: 100%;
    max-width: 360px;
  }
}
</style>