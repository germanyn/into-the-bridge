import { SpriteParams } from "./IsometricSprite"
import { Unit } from "./Unit"

export const HERO_SPRITE = 'hero'

export type HeroParams = SpriteParams 

export class Hero extends Unit {
  constructor(spriteParams: HeroParams) {
    super(
      HERO_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -16,
      },
      {
        baseLife: 3,
        baseMovement: 3,
      },
    )
  }
}