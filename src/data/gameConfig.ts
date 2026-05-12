export interface Chicken {
  id: string
  level: number
  emoji: string
  name: string
}

export interface ShopItem {
  level: number
  emoji: string
  name: string
  price: number
  basePrice: number
}

export interface GameState {
  grid: (Chicken | null)[][]
  coins: number
  highScore: number
  totalEarnings: number
}

export const CHICKEN_CONFIG: Record<number, { emoji: string; name: string; coinPerSecond: number; basePrice: number }> = {
  1: { emoji: '🐤', name: '小鸡仔', coinPerSecond: 1, basePrice: 10 },
  2: { emoji: '🐔', name: '小公鸡', coinPerSecond: 2, basePrice: 25 },
  3: { emoji: '🐓', name: '大公鸡', coinPerSecond: 5, basePrice: 60 },
  4: { emoji: '🦃', name: '火鸡', coinPerSecond: 12, basePrice: 150 },
  5: { emoji: '🐦', name: '鸟', coinPerSecond: 30, basePrice: 380 },
  6: { emoji: '🕊️', name: '鸽子', coinPerSecond: 75, basePrice: 950 },
  7: { emoji: '🦆', name: '鸭子', coinPerSecond: 180, basePrice: 2300 },
  8: { emoji: '🦢', name: '天鹅', coinPerSecond: 450, basePrice: 5800 },
  9: { emoji: '🦉', name: '猫头鹰', coinPerSecond: 1100, basePrice: 14500 },
  10: { emoji: '🦅', name: '老鹰', coinPerSecond: 2800, basePrice: 36000 },
  11: { emoji: '🦜', name: '鹦鹉', coinPerSecond: 7000, basePrice: 90000 },
  12: { emoji: '🐧', name: '企鹅', coinPerSecond: 17500, basePrice: 225000 },
  13: { emoji: '🦚', name: '孔雀', coinPerSecond: 44000, basePrice: 560000 },
  14: { emoji: '🔥', name: '火凤凰', coinPerSecond: 110000, basePrice: 1400000 },
  15: { emoji: '👑', name: '鸡王', coinPerSecond: 275000, basePrice: 3500000 }
}

export const GRID_SIZE = 5
export const MAX_LEVEL = 15

export function generateShopItems(): ShopItem[] {
  const items: ShopItem[] = []
  for (let level = 1; level <= MAX_LEVEL; level++) {
    const config = CHICKEN_CONFIG[level]
    if (config) {
      const priceMultiplier = Math.pow(1.25, level - 1)
      items.push({
        level,
        emoji: config.emoji,
        name: config.name,
        basePrice: config.basePrice,
        price: Math.floor(config.basePrice * priceMultiplier)
      })
    }
  }
  return items
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function createChicken(level: number): Chicken {
  const config = CHICKEN_CONFIG[level]
  return {
    id: generateId(),
    level,
    emoji: config?.emoji || '🐔',
    name: config?.name || '鸡'
  }
}

export function getTotalCoinPerSecond(grid: (Chicken | null)[][]): number {
  let total = 0
  for (const row of grid) {
    for (const chicken of row) {
      if (chicken) {
        const config = CHICKEN_CONFIG[chicken.level]
        if (config) {
          total += config.coinPerSecond
        }
      }
    }
  }
  return total
}

export function createEmptyGrid(): (Chicken | null)[][] {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
}