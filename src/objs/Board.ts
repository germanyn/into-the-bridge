import { BOARD_SIZE } from "../constants"
import MainScene from "../scenes/GameScene"
import { IsometricSprite } from "./IsometricSprite"
import { PathNode } from "./path-finding/PathNode"
import { Floor } from "./tiles/Floor"
import { Tile } from "./tiles/Tile"
import { Unit } from "./Unit"

export class Board extends Phaser.GameObjects.Group {
  declare scene: MainScene
  floors: Floor[][]
  unities: IsometricSprite[] = []

  constructor(scene: MainScene) {
    super(scene)
    this.floors = Array.from(Array(BOARD_SIZE), (_, x) => {
      return Array.from(Array(BOARD_SIZE), (_, y) => {
        const tile = new Floor(scene, x, y)
        tile.setInteractive()
        this.add(tile)
        return tile
      })
    })
    this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_: never, objects: Phaser.GameObjects.Sprite[]) => {
      if (objects.some(object => object instanceof Floor)) return
      this.scene.events.emit('deselect-all')
    })
    this.scene.events.addListener('select-tile', (tile: Tile) => {
      this.paintMoves(tile)
    })
  }

  addUnit(unit: Unit) {
    this.add(unit)
    this.unities.push(unit)
    const floor = this.floors[unit.gridX]?.[unit.gridY]
    if (!floor) throw new Error("There's no floor for this unit")
    floor.addUnit(unit)
  }

  paintMoves(tile: Tile) {
    if (!tile.unit) return
    const unit = tile.unit
    const color = unit.controller === 'player'
      ? 0x00ff00
      : 0xff0000
    tile.unit.paths.forEach(path => {
      const tile = this.getPathTile(path)
      tile?.paintMovableSelect(color)
    })
  }

  getPathTile(path: PathNode[]): Tile | undefined {
    const endNode = path.at(-1)
    if (!endNode) return
    return this.floors[endNode.x][endNode.y]
  }
}