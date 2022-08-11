import { IsometricSprite, SpriteParams } from "../IsometricSprite"

export interface Projectile {
  new(spriteParams: SpriteParams, direction: Phaser.Math.Vector2): Projectile
  setDirection(direction: Phaser.Math.Vector2): void
}

export abstract class Projectile extends IsometricSprite {
}

type InstantiableProjectile<T extends Projectile> = {
  new(spriteParams: SpriteParams, direction: Phaser.Math.Vector2): T
}

export type ProjectileDerivedClass = InstantiableProjectile<Projectile>
