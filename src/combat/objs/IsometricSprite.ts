import { Math } from "phaser"
import { BOARD_SIZE, CENTER_X, CENTER_Y, TILE_HHEIGHT, TILE_HWIDTH } from "../constants/board-constants"
import CombatScene from "../scenes/CombatScene"

export type SpriteParams = {
  scene: CombatScene
  x: number
  y: number
  offsetX?: number
  offsetY?: number
  frame?: number | string
}

export type UnitParams = {
  baseLife?: number
  baseMovement?: number
}

export class IsometricSprite extends Phaser.GameObjects.Sprite {
  declare scene: CombatScene
  offsetX: number
  offsetY: number
  gridX: number
  gridY: number

  constructor(textureName: string, {
    scene,
    x,
    y,
    offsetX = 0,
    offsetY = 0,
    frame,
  }: SpriteParams) {
    const [tx, ty] = scene.calculateTilePosition([x, y])
    super(scene, tx + offsetX, ty + offsetY, textureName, frame)
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.gridX = x
    this.gridY = y
    this.scene.add.existing(this)
    this.adjustDepth()
  }

  adjustDepth() {
    this.depth = IsometricSprite.calculatePositionDepth(this.gridX, this.gridY)
  }

  get point(): Math.Vector2 {
    return new Math.Vector2(this.gridX, this.gridY)
  }

  static calculatePositionDepth(x: number, y: number) {
    return x + (BOARD_SIZE - y) * BOARD_SIZE
  }
}