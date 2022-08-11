import CombatScene from "../../scenes/CombatScene";
import { createSpriteLeapAnimation } from "../../utils";
import { Arrow } from "../projectiles/Arrow";
import { ProjectileDerivedClass } from "../projectiles/Projectile";
import { Effect } from "./Effect";

export type OnProjectileHitHander = (target: Phaser.Math.Vector2) => Effect[]

export class ArtilleryEffect extends Effect {
  constructor(
    scene: CombatScene,
    public origin: Phaser.Math.Vector2,
    public direction: Phaser.Math.Vector2,
    public distance: number,
    public onHit: OnProjectileHitHander,
    public ProjectileClass: ProjectileDerivedClass,
  ) {
    super(scene)
  }
  async apply() {
    const path = this.projectilePath
    if (!path.length) return
    const lastPoint = path.at(-1)
    if (!lastPoint) return
    const targetTile = this.scene.board.getTileAt(lastPoint)
    if (!targetTile) return

    const startPoint = this.origin.clone()

    const arrow = new this.ProjectileClass({
      scene: this.scene,
      x: startPoint.x,
      y: startPoint.y,
    }, this.direction)

    const animation = createSpriteLeapAnimation(
      arrow,
      lastPoint,
      {
        duration: 1500,
      },
    )

    const targetHitAnimation = new Promise<void>(resolve => {
      animation.once(Phaser.Tweens.Events.TIMELINE_COMPLETE, () => {
        arrow.destroy()
        resolve()
      })
    })
    animation.play()
    await targetHitAnimation

    const onHitEffects = this.onHit(targetTile.point)
    for (const effect of onHitEffects) {
      await effect.apply()
    }
    return
  }

  get projectilePath() {
    const path: Phaser.Math.Vector2[] = []
    let target = this.origin.clone()
    for (let i = 0; i < this.distance; ++i) {
      target.add(this.direction)
      const tile = this.scene.board.getTileAt(target)
      if (!tile) return path
      path.push(target.clone())
    }
    return path
  }
}