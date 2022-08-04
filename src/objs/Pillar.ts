import { SpriteParams, UnitParams } from "./IsometricSprite"
import { Unit } from "./Unit"

export const PILLAR_SPRITE = 'pillar'

export type PillarParams = UnitParams

export class Pillar extends Unit {
  constructor(params: SpriteParams) {
    super(PILLAR_SPRITE, {
      ...params,
      y: params.y, 
      offsetY: -24,
    }, {
      baseLife: 2,
    })
    this.alpha = 0.80
    this.name = 'Pillar'
  }

}