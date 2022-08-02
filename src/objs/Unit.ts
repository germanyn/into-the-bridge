import { CENTER_X, CENTER_Y, TILE_HHEIGHT, TILE_HWIDTH } from "../constants"
import { IsometricSprite, SpriteParams } from "./IsometricSprite"

export type UnitParams = {
  baseLife?: number
  baseMovement?: number
}

export type ControllerType = 'none' | 'player' | 'enemy'

export abstract class Unit extends IsometricSprite {
  baseLife: number
  baseMovement: number
  controller: ControllerType = 'none'

  constructor(textureName: string, spriteParams: SpriteParams, {
    baseLife = 0,
    baseMovement = 0,
  }: UnitParams = {}) {
    super(textureName, spriteParams)
    this.baseLife = baseLife
    this.baseMovement = baseMovement
  }
}