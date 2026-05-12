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
        @click.stop="showAllItems = !showAllItems"
      >
        {{ showAllItems ? '收起' : '显示全部' }}
      </button>
    </div>

    <div class="shop-items">
      <div
        v-for="item in showAllItems ? gameStore.shopItems : gameStore.shopItems.slice(0, 6)"
        :key="item.level"
        class="shop-item-wrapper"
      >
        <div
          :class="['shop-item', { 'affordable': canAfford(item.price), 'unaffordable': !canAfford(item.price) }]"
          @click.stop="gameStore.buyFromShop(item.level)"
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
    </div>

    <div v-if="gameStore.gridFull" class="warning-message">
      ⚠️ 网格已满！请先出售或合成一些鸡
    </div>
  </div>
</template>

<style scoped>
.shop-panel {
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 40, 0.95) 100%);
  border-radius: 18px;
  padding: 20px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 6px 14px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.toggle-btn.active {
  background: rgba(255, 215, 0, 0.3);
  border-color: #ffd700;
}

.shop-items {
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: auto;
}

.shop-items::-webkit-scrollbar {
  width: 6px;
}

.shop-items::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.shop-items::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.shop-item-wrapper {
  padding: 4px;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
}

.shop-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.shop-item.affordable {
  background: rgba(17, 153, 142, 0.25);
  border: 1px solid rgba(56, 239, 125, 0.4);
}

.shop-item.affordable:hover {
  background: rgba(17, 153, 142, 0.35);
  border-color: rgba(56, 239, 125, 0.6);
  box-shadow: 0 4px 16px rgba(56, 239, 125, 0.15);
}

.shop-item.unaffordable {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0.55;
}

.item-emoji {
  font-size: 24px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.item-info {
  flex: 1;
}

.item-name {
  color: white;
  font-weight: bold;
  font-size: 13px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.item-price {
  color: #ffd700;
  font-size: 12px;
  margin-top: 2px;
  font-weight: 600;
}

.item-cps {
  color: #38ef7d;
  font-size: 11px;
  margin-top: 1px;
}

.item-roi {
  text-align: center;
  padding: 5px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  min-width: 55px;
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
  padding: 14px;
  background: rgba(255, 140, 0, 0.2);
  border: 1px solid rgba(255, 140, 0, 0.4);
  border-radius: 10px;
  color: #ffa502;
  font-size: 13px;
  text-align: center;
}
</style>