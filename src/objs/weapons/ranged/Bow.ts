import MainScene from "../../../scenes/GameScene";
import { DirectDamageEffect } from "../../effects/DirectDamageEffect";
import { Effect } from "../../effects/Effect";
import { OnProjectileHitHander, ProjectileEffect } from "../../effects/ProjectileEffect";
import { PushEffect } from "../../effects/PushEffect";
import { Tile } from "../../tiles/Tile";
import { RangeType } from "../RangeType";
import { Weapon } from "../Weapon";

export class Bow extends Weapon {
  name = 'Shot'
  description = 'Damage the first target at the direction'
  rangeType = RangeType.PROJECTILE
  icon = 'bow-icon'

  constructor(scene: MainScene) {
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
    const onHit: OnProjectileHitHander = (target) => {
      const targetTile = this.scene.board.getTileAt(target)
      if (!targetTile) return []
      return [
        new DirectDamageEffect(this.scene, targetTile, this.damage),
        new PushEffect(this.scene, targetTile, direction),
      ]
    } 
    return [
      new ProjectileEffect(
        this.scene,
        origin,
        direction,
        onHit,
      )
    ]
  }

}