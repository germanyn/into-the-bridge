import { SpriteParams } from "../../IsometricSprite";
import { Unit } from "../Unit";
import { Punch } from "../../weapons/meele/Punch";

export const GOBLIN_SPRITE = 'goblin'

export type GoblinParams = SpriteParams

export class Goblin extends Unit {
  constructor(spriteParams: GoblinParams) {
    super(
      GOBLIN_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -14,
      },
      {
        baseLife: 2,
        baseMovement: 2,
        controller: 'enemy',
      },
    )
    this.weapons = [
      new Punch(this.scene),
    ]
    this.sprite.scale = 0.6
    this.name = 'Goblin'
    this.sprite.flipX = true
    this.sprite.anims.play('goblin-idle')
  }
}