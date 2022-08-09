import { SpriteParams } from "../../IsometricSprite"
import { Unit } from "../../Unit"
import { Punch } from "../../weapons/meele/Punch"
import { Bow } from "../../weapons/ranged/Bow"

export const ARCHER_SPRITE = 'archer'

export type ArcherParams = SpriteParams

export class Archer extends Unit {
  constructor(spriteParams: ArcherParams) {
    super(
      ARCHER_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -16,
      },
      {
        baseLife: 1,
        baseMovement: 2,
      },
    )
    this.controller = 'enemy'
    this.weapons = [
      new Bow(this.scene),
    ]
    this.name = 'Archer'
    this.sprite.flipX = true
  }
}