import { SpriteParams } from "./IsometricSprite";
import { Unit } from "./Unit";

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
        baseLife: 1,
        baseMovement: 2,
      },
    )
    this.scale = 0.5
    this.controller = 'enemy'
  }
}