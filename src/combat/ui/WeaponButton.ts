import { GameObjects } from "phaser"
import { Unit } from "../objs/units/Unit"
import { Weapon } from "../objs/weapons/Weapon"
import { UIScene } from "../scenes/UIScene"

export class WeaponButton extends GameObjects.Image {
  static WIDTH = 24
  static HEIGHT = 24
  declare scene: UIScene

  constructor(
    [scene, x, y]: [UIScene, number, number],
    public unit: Unit,
    public weapon: Weapon,
    public canAttack: boolean = true,
    onAttack: () => {},
  ) {
    super(scene, x, y, weapon.icon)
    scene.add.existing(this)
    this.setInteractive()
    this.height = WeaponButton.HEIGHT
    this.width = WeaponButton.WIDTH
    this.on(Phaser.Input.Events.POINTER_DOWN, () => onAttack())
    this.updateState()
  }

  updateState() {
    if (!this.unit.canAttack) {
      this.setTint(0x444444)
    } else {
      this.clearTint()
    }
  }
}