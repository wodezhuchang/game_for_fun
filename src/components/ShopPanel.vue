<script setup lang="ts">
import { ref } from 'vue'
import { useChickenGameStore } from '../stores/chickenGameStore'
import { CHICKEN_CONFIG } from '../data/gameConfig'

const gameStore = useChickenGameStore()
const showAllItems = ref(false)

function canAfford(price: number): boolean {
  return gameStore.coins >= price
}

function getCoinPerSecond(level: number): number {
  return CHICKEN_CONFIG[level]?.coinPerSecond || 0
}

function getROI(level: number, price: number): number {
  const cps = getCoinPerSecond(level)
  if (cps === 0) return 0
  return Math.floor(price / cps)
}
</script>

<template>
  <div class="shop-panel">
    <div class="shop-header">
      <h3>🏪 商店</h3>
      <button
        :class="['toggle-btn', { 'active': showAllItems }]"
        @click="showAllItems = !showAllItems"
      >
        {{ showAllItems ? '收起' : '显示全部' }}
      </button>
    </div>

    <div class="shop-items">
      <div
        v-for="item in showAllItems ? gameStore.shopItems : gameStore.shopItems.slice(0, 6)"
        :key="item.level"
        :class="['shop-item', { 'affordable': canAfford(item.price), 'unaffordable': !canAfford(item.price) }]"
        @click="gameStore.buyFromShop(item.level)"
      >
        <div class="item-emoji">{{ item.emoji }}</div>
        <div class="item-info">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-price">💰 {{ item.price.toLocaleString() }}</div>
          <div class="item-cps">⚡ {{ getCoinPerSecond(item.level) }}/秒</div>
        </div>
        <div class="item-roi">
          <span class="roi-label">回本时间</span>
          <span class="roi-value">{{ getROI(item.level, item.price) }}秒</span>
        </div>
      </div>
    </div>

    <div v-if="gameStore.gridFull" class="warning-message">
      ⚠️ 网格已满！请先出售或合成一些鸡
    </div>
  </div>
</template>

<style scoped>
.shop-panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.shop-header h3 {
  color: white;
  font-size: 20px;
  margin: 0;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 6px 12px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toggle-btn.active {
  background: rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
}

.shop-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.shop-items::-webkit-scrollbar {
  width: 6px;
}

.shop-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.shop-items::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shop-item.affordable {
  background: linear-gradient(135deg, rgba(17, 153, 142, 0.3) 0%, rgba(56, 239, 125, 0.2) 100%);
  border: 1px solid rgba(56, 239, 125, 0.4);
}

.shop-item.affordable:hover {
  transform: translateX(4px);
  background: linear-gradient(135deg, rgba(17, 153, 142, 0.4) 0%, rgba(56, 239, 125, 0.3) 100%);
}

.shop-item.unaffordable {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.6;
}

.item-emoji {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.item-info {
  flex: 1;
}

.item-name {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.item-price {
  color: #ffd700;
  font-size: 13px;
  margin-top: 4px;
}

.item-cps {
  color: #38ef7d;
  font-size: 11px;
  margin-top: 2px;
}

.item-roi {
  text-align: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  min-width: 70px;
}

.roi-label {
  display: block;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.roi-value {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #ffa502;
}

.warning-message {
  margin-top: 16px;
  padding: 12px;
  background: rgba(255, 140, 0, 0.2);
  border: 1px solid rgba(255, 140, 0, 0.4);
  border-radius: 8px;
  color: #ffa502;
  font-size: 13px;
  text-align: center;
}
</style>