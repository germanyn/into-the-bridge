import { IsometricSprite, SpriteParams } from "../IsometricSprite";

export interface Projectile {
  new(spriteParams: SpriteParams, direction: Phaser.Math.Vector2): void
  setDirection(direction: Phaser.Math.Vector2): void
}

export abstract class Projectile extends IsometricSprite {
}