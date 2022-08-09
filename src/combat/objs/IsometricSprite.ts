import { Math } from "phaser"
import { BOARD_SIZE, CENTER_X, CENTER_Y, TILE_HHEIGHT, TILE_HWIDTH } from "../constants/board-constants"
import CombatScene from "../scenes/CombatScene"

export type SpriteParams = {
  scene: CombatScene
  x: number
  y: number
  offsetX?: number
  offsetY?: number
  frame?: number
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

  setGridX(gridX: number) {
    this.setX(this.getXByGridX(gridX))
  }

  setGridY(gridY: number) {
    this.setY(this.getYByGridY(gridY))
  }

  getXByGridX(gridX: number, {
    x = this.x,
    y = this.y,
    offsetX = this.offsetX,
  }: Partial<SpriteParams> = {}) {
    const tx = (x - y) * TILE_HWIDTH + CENTER_X
    return tx + offsetX
  }

  getYByGridY(gridY: number, {
    x = this.x,
    y = this.y,
    offsetY = this.offsetY,
  }: Partial<SpriteParams> = {}) {
    const ty = (x + y) * TILE_HHEIGHT + CENTER_Y
    return ty + offsetY
  }

  adjustDepth() {
    this.depth = IsometricSprite.calculatePositionDepth(this.gridX, this.gridY)
  }

  get point(): Math.Vector2 {
    return new Math.Vector2(this.gridX, this.gridY)
  }

  static calculatePositionDepth(x: number, y: number) {
    return x + y * BOARD_SIZE
  }
}