import { BOARD_SIZE, CENTER_X, CENTER_Y, TILE_HHEIGHT, TILE_HWIDTH } from "../constants"
import MainScene from "../scenes/GameScene"

export type SpriteParams = {
  scene: MainScene
  x: number
  y: number
  offsetX?: number
  offsetY?: number
}

export type UnitParams = {
  baseLife?: number
  baseMovement?: number
}

export type ControllerType = 'none' | 'player' | 'enemy'

export class IsometricSprite extends Phaser.GameObjects.Sprite {
  declare scene: MainScene
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
  }: SpriteParams) {
    const [tx, ty] = scene.calculateTilePosition([x, y])
    super(scene, tx + offsetX, ty + offsetY, textureName)
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
    this.depth = this.gridX + this.gridY * BOARD_SIZE
  }
}