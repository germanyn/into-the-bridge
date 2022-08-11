import { ALL_DIRECTIONS } from "../../../constants/directions-constants";
import CombatScene from "../../../scenes/CombatScene";
import { ArtilleryEffect } from "../../effects/ArtilleryEffect";
import { DirectDamageEffect } from "../../effects/DirectDamageEffect";
import { Effect } from "../../effects/Effect";
import { OnProjectileHitHander, ProjectileEffect } from "../../effects/ProjectileEffect";
import { PushEffect } from "../../effects/PushEffect";
import { IsometricSprite } from "../../IsometricSprite";
import { SmallFireball } from "../../projectiles/SmallFireball";
import { Tile } from "../../tiles/Tile";
import { RangeType } from "../RangeType";
import { Weapon } from "../Weapon";

export class Fireball extends Weapon {
  name = 'Fireball'
  description = 'Damage target tile and push adjacent units'
  rangeType = RangeType.ARTILLERY
  icon = 'wand-icon'

  constructor(scene: CombatScene) {
    super(scene)
    this.pathSize = Infinity
    this.damage = 1
  }

  getSkillEffect(originTile: Tile, targetTile: Tile): Effect[] {
    if (!originTile) return []
    const origin = originTile.point
    const direction = targetTile.point
      .clone()
      .subtract(origin)
      .normalize()
    const distance = Math.abs(originTile.point.distance(targetTile.point))
    const onHit: OnProjectileHitHander = (target) => {
      const targetTile = this.scene.board.getTileAt(target)
      if (!targetTile) return []

      const adjacentEffects: PushEffect[] = []
      for (const direction of ALL_DIRECTIONS) {
        const adjacentPoint = direction
          .clone()
          .add(target)
        const tile = this.scene.board.getTileAt(adjacentPoint)
        if (!tile)  continue

        adjacentEffects.push(
          new PushEffect(
            this.scene,
            tile,
            direction,
          )
        )
      }

      return [
        new DirectDamageEffect(
          this.scene,
          targetTile,
          this.damage,
          (tile) => {
            return new IsometricSprite('', {
              scene: this.scene,
              x: tile.gridX,
              y: tile.gridY,
              offsetY: -32,
            }).play('explosion-idle')
          },
        ),
        ...adjacentEffects,
      ]
    }
    return [
      new ArtilleryEffect(
        this.scene,
        origin,
        direction,
        distance,
        onHit,
        SmallFireball,
      )
    ]
  }

}