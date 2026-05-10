import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'game_progress'

interface GameProgress {
  score: number
  level: number
  coins: number
  highScore: number
  lastPlayed: string
}

interface ExportedProgress {
  version: string
  data: GameProgress
  exportedAt: string
  checksum: string
}

function loadProgress(): GameProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.warn('Failed to load game progress')
  }
  return {
    score: 0,
    level: 1,
    coins: 0,
    highScore: 0,
    lastPlayed: new Date().toISOString()
  }
}

function saveProgress(progress: GameProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    console.warn('Failed to save game progress')
  }
}

function calculateChecksum(data: GameProgress): string {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

export const useGameStore = defineStore('game', () => {
  const progress = ref<GameProgress>(loadProgress())

  watch(
    progress,
    (newProgress) => {
      saveProgress({ ...newProgress, lastPlayed: new Date().toISOString() })
    },
    { deep: true }
  )

  function addScore(points: number) {
    progress.value.score += points
    if (progress.value.score > progress.value.highScore) {
      progress.value.highScore = progress.value.score
    }
    checkLevelUp()
  }

  function addCoins(amount: number) {
    progress.value.coins += amount
  }

  function spendCoins(amount: number): boolean {
    if (progress.value.coins >= amount) {
      progress.value.coins -= amount
      return true
    }
    return false
  }

  function checkLevelUp() {
    const newLevel = Math.floor(progress.value.score / 100) + 1
    if (newLevel > progress.value.level) {
      progress.value.level = newLevel
      addCoins(newLevel * 10)
    }
  }

  function resetGame() {
    progress.value.score = 0
    progress.value.level = 1
    progress.value.coins = 0
  }

  function clearProgress() {
    localStorage.removeItem(STORAGE_KEY)
    progress.value = {
      score: 0,
      level: 1,
      coins: 0,
      highScore: progress.value.highScore,
      lastPlayed: new Date().toISOString()
    }
  }

  function exportProgress(): string {
    const exported: ExportedProgress = {
      version: '1.0',
      data: { ...progress.value },
      exportedAt: new Date().toISOString(),
      checksum: calculateChecksum(progress.value)
    }
    return JSON.stringify(exported, null, 2)
  }

  function importProgress(jsonString: string): { success: boolean; message: string } {
    try {
      const exported: ExportedProgress = JSON.parse(jsonString)
      
      if (!exported.version || !exported.data) {
        return { success: false, message: '无效的进度文件格式' }
      }

      if (exported.version !== '1.0') {
        return { success: false, message: `不支持的版本: ${exported.version}` }
      }

      const expectedChecksum = calculateChecksum(exported.data)
      if (exported.checksum !== expectedChecksum) {
        return { success: false, message: '文件校验失败，可能已损坏或被篡改' }
      }

      progress.value = { ...exported.data, lastPlayed: new Date().toISOString() }
      return { success: true, message: '进度导入成功！' }
    } catch (e) {
      return { success: false, message: '解析文件失败，请确保是有效的JSON文件' }
    }
  }

  return {
    progress,
    addScore,
    addCoins,
    spendCoins,
    resetGame,
    clearProgress,
    exportProgress,
    importProgress
  }
})