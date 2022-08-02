import { CENTER_X, CENTER_Y, TILE_HHEIGHT, TILE_HWIDTH } from "../constants"

export type SpriteParams = {
  scene: Phaser.Scene
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

export abstract class IsometricSprite extends Phaser.GameObjects.Sprite {
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
    const tx = (x - y) * TILE_HWIDTH + CENTER_X
    const ty = (x + y) * TILE_HHEIGHT + CENTER_Y
    super(scene, tx + offsetX, ty + offsetY, textureName)
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.gridX = x
    this.gridY = y
    this.scene.add.existing(this)
    this.depth = CENTER_Y + ty
  }
}