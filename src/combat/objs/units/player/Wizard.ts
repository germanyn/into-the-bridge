import { SpriteParams } from "../../IsometricSprite"
import { Unit } from "../Unit"
import { Fireball } from "../../weapons/artillery/Fireball"

export const WIZARD_SPRITE = 'wizard'

export type WizardParams = SpriteParams

export class Wizard extends Unit {
  constructor(spriteParams: WizardParams) {
    super(
      WIZARD_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -16,
        frame: 0,
      },
      {
        baseLife: 2,
        baseMovement: 2,
        controller: 'player',
      },
    )
    this.scale = 0.75
    this.weapons = [
      new Fireball(this.scene),
    ]
    this.name = 'Wizard'
    this.sprite.anims.play(`wizard-idle`)
  }
}