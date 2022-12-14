import { DOWN, LEFT, RIGHT, UP } from "../../constants/directions-constants";
import { SpriteParams } from "../IsometricSprite";
import { Projectile } from "./Projectile";

export const ARROW_SPRITE = 'arrow'

export class Arrow extends Projectile {
  constructor(
    spriteParams: SpriteParams,
    direction: Phaser.Math.Vector2,
  ) {
    const spriteOffsetY = -16
    super(
      ARROW_SPRITE,
      {
        ...spriteParams,
        offsetY: (spriteParams.offsetY ?? 0) + spriteOffsetY,
        frame: 0,
      },
    )
    this.angleOffset = 90
    this.setScale(1/4)
    this.setDirection(direction)
  }
}