<script setup lang="ts">
import ClickGame from '../components/ClickGame.vue'
</script>

<template>
  <div class="home">
    <h1>🎮 单人页面游戏演示</h1>
    <ClickGame />
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px;
}

h1 {
  text-align: center;
  color: white;
  font-size: 32px;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(102, 126, 234, 0.5);
}
</style>