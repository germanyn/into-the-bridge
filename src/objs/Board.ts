import { BOARD_SIZE, TILE_HEIGHT, TILE_WIDTH } from "../constants"
import MainScene from "../scenes/GameScene"
import { Floor } from "./tiles/Floor"
import { IsometricSprite } from "./IsometricSprite"
import { Unit } from "./Unit"

export class Board extends Phaser.GameObjects.Group {

  floors: Floor[][]
  floorGroup: Phaser.GameObjects.Group
  unities: IsometricSprite[] = []
  unitiesGroup: Phaser.GameObjects.Group

  constructor(scene: MainScene) {
    super(scene)
    this.floors = Array.from(Array(BOARD_SIZE), (_, x) => {
      return Array.from(Array(BOARD_SIZE), (_, y) => {
        const tile = new Floor(scene, x, y)
        tile.setInteractive()
        this.add(tile)
        this.centerSprite(tile)
        return tile
      })
    })
    this.floorGroup = scene.add.group(this.floors.flatMap(row => row))
    this.unitiesGroup = scene.add.group()
    this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_: never, objects: Phaser.GameObjects.Sprite[]) => {
      if (objects.some(object => object instanceof Floor)) return
      this.scene.events.emit('deselect-all')
    })
  }

  addUnit(unit: Unit) {
    this.add(unit)
    this.centerSprite(unit)
    this.unities.push(unit)
    const floor = this.floors.at(unit.gridX)?.at(unit.gridY)
    if (!floor) throw new Error("There's no floor for this unit")
    floor.addUnit(unit)
    this.unitiesGroup.add(unit)
  }

  centerSprite(sprite: Phaser.GameObjects.Sprite) {
    sprite.setX(sprite.x + (this.scene.renderer.width - BOARD_SIZE * TILE_WIDTH) / 2)
    sprite.setY(sprite.y + (this.scene.renderer.height - BOARD_SIZE * TILE_HEIGHT) / 2)
  }
}