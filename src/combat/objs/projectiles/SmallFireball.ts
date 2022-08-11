import { DOWN, LEFT, RIGHT, UP } from "../../constants/directions-constants";
import { SpriteParams } from "../IsometricSprite";
import { Projectile } from "./Projectile";

export const ARROW_SPRITE = 'small-fireball'

export class SmallFireball extends Projectile {
  constructor(
    spriteParams: SpriteParams,
    direction: Phaser.Math.Vector2,
  ) {
    const spriteOffsetY = 0
    super(
      ARROW_SPRITE,
      {
        ...spriteParams,
        offsetY: (spriteParams.offsetY ?? 0) + spriteOffsetY,
        frame: 0,
      },
    )
    this.angleOffset = 0
    this.setDirection(direction)
    this.anims.play('fireball-idle')
  }
}