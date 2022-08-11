import { RIGHT } from "../../constants/directions-constants"
import { IsometricSprite, SpriteParams } from "../IsometricSprite"

export interface Projectile {
  new(spriteParams: SpriteParams, direction: Phaser.Math.Vector2): Projectile
  setDirection(direction: Phaser.Math.Vector2): void
}

export abstract class Projectile extends IsometricSprite {
  angleOffset = 0
  direction = RIGHT
  setDirection(direction: Phaser.Math.Vector2) {
    this.direction = direction
    const radiansAngle = xyToIso(direction).angle() + degreesToRadians(this.angleOffset)
    const degrees = radianToDegrees(radiansAngle)
    this.setAngle(degrees)
    // if (this.direction.equals(UP)) {
    //   this.setAngle(60 + this.angleOffset)
    // } else if (this.direction.equals(RIGHT)) {
    //   this.setAngle(120 +  this.angleOffset)
    // } else if (this.direction.equals(DOWN)) {
    //   this.setAngle(-120 + this.angleOffset)
    // } else if (this.direction.equals(LEFT)) {
    //   this.setAngle(-60 +  this.angleOffset)
    // }
  }
}

type InstantiableProjectile<T extends Projectile> = {
  new(spriteParams: SpriteParams, direction: Phaser.Math.Vector2): T
}

export type ProjectileDerivedClass = InstantiableProjectile<Projectile>


function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function radianToDegrees(radians: number) {
  return radians * (180/Math.PI);
}

function xyToIso(v: Phaser.Math.Vector2) {
  return new Phaser.Math.Vector2(v.x + v.y, 0.5 * (v.x - v.y))
}