import { SpriteParams } from "./IsometricSprite"
import { Tile } from "./tiles/Tile"
import { Unit } from "./Unit"
import { Punch } from "./weapons/meele/Punch"

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
    this.controller = 'player'
    this.weapons = [
      new Punch(this.scene),
      new Punch(this.scene),
    ]
    this.name = 'Hero'
  }
}