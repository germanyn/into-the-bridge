import { BOARD_SIZE, TILE_HEIGHT, TILE_WIDTH } from "../constants"
import MainScene from "../scenes/GameScene"
import { Floor } from "./tiles/Floor"
import { IsometricSprite } from "./IsometricSprite"
import { Unit } from "./Unit"
import { Tile } from "./tiles/Tile"
import { PathFinding } from "./path-finding/PathFinding"
import { PathNode } from "./path-finding/PathNode"

export class Board extends Phaser.GameObjects.Group {

  declare scene: MainScene
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
        return tile
      })
    })
    this.floorGroup = scene.add.group(this.floors.flatMap(row => row))
    this.unitiesGroup = scene.add.group()
    this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_: never, objects: Phaser.GameObjects.Sprite[]) => {
      if (objects.some(object => object instanceof Floor)) return
      this.scene.events.emit('deselect-all')
    })
    this.scene.events.addListener('select-tile', (tile: Tile) => {
      this.paintMoves(tile)
    })
    scene.physics.add.overlap(this.unitiesGroup, this.floorGroup, (data1, data2) => {
      console.log(data1)
      console.log(data2)
    })
  }

  addUnit(unit: Unit) {
    this.add(unit)
    this.unities.push(unit)
    const floor = this.floors[unit.gridX]?.[unit.gridY]
    if (!floor) throw new Error("There's no floor for this unit")
    floor.addUnit(unit)
    this.unitiesGroup.add(unit)
  }

  paintMoves(tile: Tile) {
    if (!tile.unit) return
    tile.unit.paths.forEach(path => {
      const tile = this.getPathTile(path)
      tile?.paintMovableSelect()
    })
  }

  getPathTile(path: PathNode[]): Tile | undefined {
    const endNode = path.at(-1)
    if (!endNode) return
    return this.floors[endNode.x][endNode.y]
  }
}