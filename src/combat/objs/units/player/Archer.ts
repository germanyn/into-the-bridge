import { SpriteParams } from "../../IsometricSprite"
import { Unit } from "../../Unit"
import { Bow } from "../../weapons/ranged/Bow"

export const ARCHER_SPRITE = 'archer'

export type ArcherParams = SpriteParams

export class Archer extends Unit {
  constructor(
    spriteParams: ArcherParams,
    color: 'blue' | 'yellow' | 'red' | 'green' = 'blue'
  ) {
    super(
      ARCHER_SPRITE,
      {
        ...spriteParams,
        y: spriteParams.y,
        offsetY: -12,
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
      new Bow(this.scene),
    ]
    this.name = 'Archer'
    this.sprite.anims.play(`archer-${color}-idle`)
  }
}