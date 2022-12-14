import { ALL_DIRECTIONS } from "../../constants/directions-constants"
import CombatScene from "../../scenes/CombatScene"
import { Effect } from "../effects/Effect"
import { Tile } from "../tiles/Tile"
import { RangeType } from "./RangeType"

export abstract class Weapon {
  abstract name: string
  abstract description: string
  abstract rangeType: RangeType
  abstract icon: string
  damage = 0
  pathSize = 0

  constructor(public scene: CombatScene) {}

  getTargetArea(currentTile: Tile): Tile[] {
    const origin = new Phaser.Math.Vector2(currentTile.gridX, currentTile.gridY)
    return ALL_DIRECTIONS.flatMap<Tile>(direction => {
      const target = currentTile.point
        .clone()
        .add(direction)

      const tiles: Tile[] = []
      while(target.distance(origin) <= this.pathSize) {
        const tile = this.scene.board.getTileAt(target)
        if (!tile) return tiles
        tiles.push(tile)
        target.add(direction)
        if (
          this.rangeType === RangeType.PROJECTILE &&
          tile.unit
        ) break
      }
      return tiles
    })
  }

  async attack(origin: Tile, target: Tile): Promise<boolean> {
    const attackableTiles = this.getTargetArea(origin)
    if (!attackableTiles.some(attackTile => attackTile === target)) return false
    const effects = this.getSkillEffect(origin, target)
    for (const effect of effects) {
      await effect.apply()
    }
    return true
  }

  abstract getSkillEffect(originTile: Tile, targetTile: Tile): Effect[]
}