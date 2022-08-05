import MainScene from "../../scenes/GameScene"
import { Effect } from "../effects/Effect"
import { Tile } from "../tiles/Tile"
import { Unit } from "../Unit"
import { RangeType } from "./RangeType"

export abstract class Weapon {
  abstract name: string
  abstract description: string
  abstract rangeType: RangeType
  icon: string
  damage = 0
  pathSize = 0

  constructor(public scene: MainScene) {
    this.icon = 'attack-icon'
  }

  getTargetArea(currentTile: Tile): Tile[] {
    const origin = new Phaser.Math.Vector2(currentTile.gridX, currentTile.gridY)
    const directions = [
      new Phaser.Math.Vector2(-1, 0), // UP_LEFT,
      new Phaser.Math.Vector2(0, 1), // UP_RIGHT,
      new Phaser.Math.Vector2(1, 0), // DOWN_RIGHT,
      new Phaser.Math.Vector2(0, -1), // DOWN_LEFT,
    ]
    return directions.flatMap<Tile>(direction => {
      const target = new Phaser.Math.Vector2(currentTile.gridX, currentTile.gridY)
        .add(direction)

      const tiles: Tile[] = []
      while(target.distance(origin) <= this.pathSize) {
        const tile = this.scene.board.getTileAt(target)
        if (!tile) return tiles
        tiles.push(tile)
        target.add(direction)
      }
      return tiles
    })
  }

  attack(origin: Tile, target: Tile): boolean {
    const attackableTiles = this.getTargetArea(origin)
    if (!attackableTiles.some(attackTile => attackTile === target)) return false
    if (!target.unit) return true
    this.getSkillEffect(origin, target).forEach(effect => {
      effect.apply()
    });
    return true
  }

  abstract getSkillEffect(originTile: Tile, targetTile: Tile): Effect[]
}