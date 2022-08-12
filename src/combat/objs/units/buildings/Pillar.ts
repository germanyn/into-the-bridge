import { SpriteParams } from "../../IsometricSprite"
import { Unit } from "../Unit"

export const PILLAR_SPRITE = 'walls'

export class Pillar extends Unit {
  constructor(params: SpriteParams) {
    super(PILLAR_SPRITE, {
      ...params,
      y: params.y,
      offsetY: -24,
      frame: 70,
    }, {
      baseLife: 2,
    })
    this.alpha = 0.80
    this.name = 'Pillar'
    this.canBePushed = false
  }

}