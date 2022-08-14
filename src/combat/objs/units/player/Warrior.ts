import { SpriteParams } from "../../IsometricSprite"
import { Unit } from "../Unit"
import { Punch } from "../../weapons/meele/Punch"
import { Bow } from "../../weapons/ranged/Bow"

export const WARRIOR_SPRITE = 'warrior'

export type WarriorParams = SpriteParams

export class Warrior extends Unit {
  constructor(spriteParams: WarriorParams) {
    super(
      WARRIOR_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -12,
      },
      {
        baseLife: 3,
        baseMovement: 3,
        controller: 'player',
      },
    )
    this.sprite.scale = 0.75
    this.weapons = [
      new Punch(this.scene),
    ]
    this.name = 'Warrior'
    this.sprite.anims.play('warrior-idle')
  }
}