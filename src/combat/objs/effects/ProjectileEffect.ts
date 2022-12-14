import CombatScene from "../../scenes/CombatScene";
import { createSpriteMovementAnimation } from "../../utils";
import { ProjectileDerivedClass } from "../projectiles/Projectile";
import { Effect } from "./Effect";

export type OnProjectileHitHander = (target: Phaser.Math.Vector2) => Effect[]

export class ProjectileEffect extends Effect {
  constructor(
    scene: CombatScene,
    public origin: Phaser.Math.Vector2,
    public direction: Phaser.Math.Vector2,
    public onHit: OnProjectileHitHander,
    public ProjectileClass: ProjectileDerivedClass,
  ) {
    super(scene)
  }
  async apply() {
    const path = this.projectilePath
    if (!path.length) return
    const startPoint = this.origin.clone()
      .add(this.direction)
    const tileOffset = this.getTileOffset(this.direction)

    const arrow = new this.ProjectileClass({
      scene: this.scene,
      x: startPoint.x,
      y: startPoint.y,
      offsetX: tileOffset.x,
      offsetY: tileOffset.y,
    }, this.direction)

    const animation = createSpriteMovementAnimation(
      arrow,
      path,
      {
        duration: 50,
      },
    )

    await new Promise<void>(resolve => {
      animation.once(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
        arrow.destroy()
        resolve()
      })
      animation.play()
    })

    const lastPoint = path.at(-1)
    if (!lastPoint) return
    const targetTile = this.scene.board.getTileAt(lastPoint)
    if (!targetTile) return

    if (targetTile.unit) {
      const onHitEffects = this.onHit(targetTile.point)
      for (const effect of onHitEffects) {
        await effect.apply()
      }
      return
    }
  }

  getTileOffset(direction: Phaser.Math.Vector2) {
    return this.direction.clone()
      .multiply({ x: -8, y: -4})
  }

  get projectilePath() {
    const path: Phaser.Math.Vector2[] = []
    let target = this.origin.clone()
    while(true) {
      target.add(this.direction)
      const tile = this.scene.board.getTileAt(target)
      if (!tile) return path
      path.push(target.clone())
      if (tile.unit) return path
    }
  }
}