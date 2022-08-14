import { SpriteParams } from "../../IsometricSprite"
import { Unit } from "../Unit"

export const PILLAR_SPRITE = 'walls'

export class Pillar extends Unit {
  constructor(params: SpriteParams) {
    super(PILLAR_SPRITE, {
      ...params,
      y: params.y,
      offsetY: -24,
      frame: 73,
    }, {
      baseLife: 2,
    })
    this.name = 'Pillar'
    this.canBePushed = false
  }

}