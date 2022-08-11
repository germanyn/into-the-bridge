import { DOWN, LEFT, RIGHT, UP } from "../../constants/directions-constants";
import { SpriteParams } from "../IsometricSprite";
import { Projectile } from "./Projectile";

export const ARROW_SPRITE = 'arrow'

export class Arrow extends Projectile {
  constructor(
    spriteParams: SpriteParams,
    protected direction: Phaser.Math.Vector2,
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
    this.setScale(1/4)
    this.setDirection(direction)
  }

  setDirection(direction: Phaser.Math.Vector2) {
    this.direction = direction
    if (this.direction.equals(UP)) {
      this.setAngle(60)
    } else if (this.direction.equals(RIGHT)) {
      this.setAngle(120)
    } else if (this.direction.equals(DOWN)) {
      this.setAngle(-120)
    } else if (this.direction.equals(LEFT)) {
      this.setAngle(-60)
    }
  }
}