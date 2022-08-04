import { SpriteParams } from "./IsometricSprite"
import { Tile } from "./tiles/Tile"
import { Unit } from "./Unit"

export const HERO_SPRITE = 'hero'

export type HeroParams = SpriteParams

export class Hero extends Unit {
  constructor(spriteParams: HeroParams) {
    super(
      HERO_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -16,
      },
      {
        baseLife: 3,
        baseMovement: 3,
      },
    )
    this.controller = 'player'
  }

  toggleAttack(): boolean {
    super.toggleAttack()
    const tiles = this.attackTiles
    if (!tiles.length) return false
    tiles.forEach(tile => tile.paintAttackableTile())
    return true
  }

  get attackTiles(): Tile[] {
    if (!this.currentTile) return []
    return [
      [this.currentTile.gridX, this.currentTile.gridY - 1], // UP
      [this.currentTile.gridX, this.currentTile.gridY + 1], // DOWN
      [this.currentTile.gridX - 1, this.currentTile.gridY], // LEFT
      [this.currentTile.gridX + 1, this.currentTile.gridY], // RIGHT
    ].map(([x, y]) => this.scene.board.floors[x]?.[y])
      .filter(Boolean)
  }

  attackTile(tile: Tile): boolean {
    super.attackTile(tile)
    if (!this.attackTiles.some(attackTile => attackTile === tile)) return false
    if (!tile.unit) return true
    tile.unit.hurt(1)
    return true
  }
}