import { SpriteParams } from "../../IsometricSprite"
import { Unit } from "../../Unit"
import { Punch } from "../../weapons/meele/Punch"
import { Bow } from "../../weapons/ranged/Bow"

export const HERO_SPRITE = 'hero'

export type HeroParams = SpriteParams

export class Warrior extends Unit {
  constructor(spriteParams: HeroParams) {
    super(
      HERO_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -12,
      },
      {
        baseLife: 3,
        baseMovement: 3,
      },
    )
    this.scale = 0.6
    this.controller = 'player'
    this.weapons = [
      new Punch(this.scene),
      new Bow(this.scene),
    ]
    this.name = 'Hero'
    this.sprite.anims.play('hero-idle')
  }
}