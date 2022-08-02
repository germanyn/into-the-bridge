import { IsometricSprite, SpriteParams } from "./IsometricSprite"
import { OutlinePipeline } from "./shaders/OutlinePipeline"

export type UnitParams = {
  baseLife?: number
  baseMovement?: number
}

export type ControllerType = 'none' | 'player' | 'enemy'

export abstract class Unit extends IsometricSprite {
  selected = false
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
  select() {
    if (this.selected) return
    this.selected = true
    this.setPipeline(OutlinePipeline.KEY)
    this.pipeline.set2f(
      "uTextureSize",
      this.texture.getSourceImage().width,
      this.texture.getSourceImage().height
    )
  }

  deselect() {
    if (!this.selected) return
    this.selected = false
    this.resetPipeline()
  }
}