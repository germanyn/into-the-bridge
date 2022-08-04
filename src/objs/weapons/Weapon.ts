import { BOARD_SIZE } from "../../constants"
import MainScene from "../../scenes/GameScene"
import { isNumberBetweenOrEqual } from "../../utils/number-utils"
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
    const grid = this.scene.board.tiles
    return directions.flatMap<Tile>(direction => {
      const target = new Phaser.Math.Vector2(currentTile.gridX, currentTile.gridY)
        .add(direction)

      const tiles: Tile[] = []
      while(
        isNumberBetweenOrEqual(target.x, 0, BOARD_SIZE - 1) &&
        isNumberBetweenOrEqual(target.y, 0, BOARD_SIZE - 1) &&
        target.distance(origin) <= this.pathSize
      ) {
        tiles.push(grid[target.x][target.y])
        target.add(direction)
      }
      return tiles
    })
  }
  abstract getSkillEffect(unit: Unit, targetTile: Tile): Effect[]
}