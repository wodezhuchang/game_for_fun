import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  type Chicken,
  type ShopItem,
  CHICKEN_CONFIG,
  GRID_SIZE,
  MAX_LEVEL,
  generateShopItems,
  createChicken,
  getTotalCoinPerSecond,
  createEmptyGrid
} from '../data/gameConfig'

const STORAGE_KEY = 'chicken_game_progress'

interface SavedProgress {
  version: string
  grid: (Chicken | null)[][]
  coins: number
  highScore: number
  totalEarnings: number
  checksum: string
}

function calculateChecksum(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

function loadProgress(): { grid: (Chicken | null)[][]; coins: number; highScore: number; totalEarnings: number } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed: SavedProgress = JSON.parse(saved)
      
      if (parsed.version !== '1.0') {
        console.warn('Old save version detected, starting fresh')
        return { grid: createEmptyGrid(), coins: 50, highScore: 0, totalEarnings: 0 }
      }

      const dataStr = JSON.stringify({ grid: parsed.grid, coins: parsed.coins, highScore: parsed.highScore, totalEarnings: parsed.totalEarnings })
      const expectedChecksum = calculateChecksum(dataStr)
      if (parsed.checksum !== expectedChecksum) {
        console.warn('Save file corrupted, starting fresh')
        return { grid: createEmptyGrid(), coins: 50, highScore: 0, totalEarnings: 0 }
      }

      return {
        grid: parsed.grid,
        coins: parsed.coins,
        highScore: parsed.highScore,
        totalEarnings: parsed.totalEarnings
      }
    }
  } catch (e) {
    console.warn('Failed to load progress:', e)
  }
  return { grid: createEmptyGrid(), coins: 50, highScore: 0, totalEarnings: 0 }
}

function saveProgress(grid: (Chicken | null)[][], coins: number, highScore: number, totalEarnings: number) {
  try {
    const data = { grid, coins, highScore, totalEarnings }
    const dataStr = JSON.stringify(data)
    const saved: SavedProgress = {
      version: '1.0',
      ...data,
      checksum: calculateChecksum(dataStr)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch (e) {
    console.warn('Failed to save progress:', e)
  }
}

export const useChickenGameStore = defineStore('chickenGame', () => {
  const loaded = loadProgress()
  const grid = ref<(Chicken | null)[][]>(loaded.grid)
  const coins = ref(loaded.coins)
  const highScore = ref(loaded.highScore)
  const totalEarnings = ref(loaded.totalEarnings)
  const selectedCell = ref<{ row: number; col: number } | null>(null)
  const shopItems = ref<ShopItem[]>(generateShopItems())
  const showNotification = ref<{ type: 'success' | 'error'; message: string } | null>(null)
  const coinPerSecond = ref(0)

  const totalChickens = computed(() => {
    let count = 0
    for (const row of grid.value) {
      for (const chicken of row) {
        if (chicken) count++
      }
    }
    return count
  })

  const gridFull = computed(() => totalChickens.value >= GRID_SIZE * GRID_SIZE)

  watch(
    [grid, coins, highScore, totalEarnings],
    () => {
      saveProgress(grid.value, coins.value, highScore.value, totalEarnings.value)
    },
    { deep: true }
  )

  function updateCoinPerSecond() {
    coinPerSecond.value = getTotalCoinPerSecond(grid.value)
  }

  function addCoins(amount: number) {
    coins.value += amount
    totalEarnings.value += amount
    if (totalEarnings.value > highScore.value) {
      highScore.value = totalEarnings.value
    }
  }

  function hasEmptyCell(): boolean {
    for (const row of grid.value) {
      if (row.includes(null)) return true
    }
    return false
  }

  function findEmptyCell(): { row: number; col: number } | null {
    const emptyCells: { row: number; col: number }[] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!grid.value[row]?.[col]) {
          emptyCells.push({ row, col })
        }
      }
    }
    if (emptyCells.length === 0) return null
    const idx = Math.floor(Math.random() * emptyCells.length)
    return emptyCells[idx] ?? null
  }

  function placeChicken(level: number, row?: number, col?: number): boolean {
    let targetRow: number, targetCol: number

    if (row !== undefined && col !== undefined) {
      if (grid.value[row]?.[col]) return false
      targetRow = row
      targetCol = col
    } else {
      const empty = findEmptyCell()
      if (!empty) return false
      targetRow = empty.row
      targetCol = empty.col
    }

    if (!grid.value[targetRow]) grid.value[targetRow] = []
    const targetRowData = grid.value[targetRow]
    if (targetRowData) targetRowData[targetCol] = createChicken(level)
    updateCoinPerSecond()
    return true
  }

  function buyFromShop(level: number): boolean {
    const item = shopItems.value.find(i => i.level === level)
    if (!item) return false
    if (coins.value < item.price) {
      showMessage('error', `金币不足！需要 ${item.price} 金币`)
      return false
    }

    coins.value -= item.price
    
    if (!placeChicken(level)) {
      coins.value += item.price
      showMessage('error', '网格已满！')
      return false
    }

    showMessage('success', `成功购买 ${item.emoji} ${item.name}！`)
    return true
  }

  function selectCell(row: number, col: number) {
    const chicken = grid.value[row]?.[col]
    
    if (!selectedCell.value) {
      if (chicken) {
        selectedCell.value = { row, col }
      }
    } else {
      if (selectedCell.value.row === row && selectedCell.value.col === col) {
        selectedCell.value = null
      } else {
        moveChicken(selectedCell.value.row, selectedCell.value.col, row, col)
        selectedCell.value = null
      }
    }
  }

  function moveChicken(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const chicken = grid.value[fromRow]?.[fromCol]
    if (!chicken) return false

    const targetChicken = grid.value[toRow]?.[toCol]

    if (!targetChicken) {
      if (!grid.value[toRow]) grid.value[toRow] = []
      grid.value[toRow][toCol] = chicken
      if (grid.value[fromRow]) grid.value[fromRow][fromCol] = null
      updateCoinPerSecond()
      return true
    }

    if (targetChicken.level === chicken.level && chicken.level < MAX_LEVEL) {
      if (!grid.value[toRow]) grid.value[toRow] = []
      grid.value[toRow][toCol] = createChicken(chicken.level + 1)
      if (grid.value[fromRow]) grid.value[fromRow][fromCol] = null
      addCoins(chicken.level * 5)
      const newChicken = grid.value[toRow]?.[toCol]
      showMessage('success', `🎉 合成成功！${chicken.emoji} + ${chicken.emoji} = ${newChicken?.emoji || '?'}`,)
      updateCoinPerSecond()
      return true
    }

    showMessage('error', '无法合成！需要两只相同等级的鸡')
    return false
  }

  function sellChicken(row: number, col: number): boolean {
    const chicken = grid.value[row]?.[col]
    if (!chicken) return false

    const config = CHICKEN_CONFIG[chicken.level]
    if (!config) return false

    const sellPrice = Math.floor(config.basePrice * 0.6)
    coins.value += sellPrice
    if (grid.value[row]) grid.value[row][col] = null
    showMessage('success', `出售 ${chicken.emoji} ${chicken.name}，获得 ${sellPrice} 金币`)
    updateCoinPerSecond()
    return true
  }

  function showMessage(type: 'success' | 'error', message: string) {
    showNotification.value = { type, message }
    setTimeout(() => {
      showNotification.value = null
    }, 2000)
  }

  function resetGame() {
    grid.value = createEmptyGrid()
    coins.value = 50
    totalEarnings.value = 0
    selectedCell.value = null
    updateCoinPerSecond()
    showMessage('success', '游戏已重置！')
  }

  function clearProgress() {
    localStorage.removeItem(STORAGE_KEY)
    grid.value = createEmptyGrid()
    coins.value = 50
    highScore.value = 0
    totalEarnings.value = 0
    selectedCell.value = null
    updateCoinPerSecond()
    showMessage('success', '所有进度已清除！')
  }

  function exportProgress(): string {
    const data = { grid: grid.value, coins: coins.value, highScore: highScore.value, totalEarnings: totalEarnings.value }
    const dataStr = JSON.stringify(data)
    const exported: SavedProgress = {
      version: '1.0',
      ...data,
      checksum: calculateChecksum(dataStr)
    }
    return JSON.stringify(exported, null, 2)
  }

  function importProgress(jsonString: string): { success: boolean; message: string } {
    try {
      const exported: SavedProgress = JSON.parse(jsonString)

      if (!exported.version || !exported.grid) {
        return { success: false, message: '无效的进度文件格式' }
      }

      if (exported.version !== '1.0') {
        return { success: false, message: `不支持的版本: ${exported.version}` }
      }

      const dataStr = JSON.stringify({ grid: exported.grid, coins: exported.coins, highScore: exported.highScore, totalEarnings: exported.totalEarnings })
      const expectedChecksum = calculateChecksum(dataStr)
      if (exported.checksum !== expectedChecksum) {
        return { success: false, message: '文件校验失败，可能已损坏或被篡改' }
      }

      grid.value = exported.grid
      coins.value = exported.coins
      highScore.value = exported.highScore
      totalEarnings.value = exported.totalEarnings
      selectedCell.value = null
      updateCoinPerSecond()
      return { success: true, message: '进度导入成功！' }
    } catch (e) {
      return { success: false, message: '解析文件失败，请确保是有效的JSON文件' }
    }
  }

  updateCoinPerSecond()

  return {
    grid,
    coins,
    highScore,
    totalEarnings,
    selectedCell,
    shopItems,
    showNotification,
    coinPerSecond,
    totalChickens,
    gridFull,
    addCoins,
    buyFromShop,
    selectCell,
    sellChicken,
    resetGame,
    clearProgress,
    exportProgress,
    importProgress
  }
})