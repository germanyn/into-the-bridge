import { Math } from "phaser"
import { BOARD_SIZE } from "../constants/board-constants"
import CombatScene from "../scenes/CombatScene"
import { PathFinding } from "./path-finding/PathFinding"
import { PathNode } from "./path-finding/PathNode"
import { Floor } from "./tiles/Floor"
import { Pit } from "./tiles/Pit"
import { Tile } from "./tiles/Tile"
import { ControllerType, Unit } from "./units/Unit"

export class Board extends Phaser.GameObjects.Group {
  declare scene: CombatScene
  private tiles: Floor[][]
  unities: Unit[] = []

  constructor(scene: CombatScene) {
    super(scene)
    this.tiles = Array.from(Array(BOARD_SIZE), (_, x) => {
      return Array.from(Array(BOARD_SIZE), (_, y) => {
        if (x === 4 && y === 5) {
          const tile = new Pit(scene, x, y)
          tile.setInteractive()
          this.add(tile)
          return tile
        }
        const tile = new Floor(scene, x, y)
        tile.setInteractive()
        this.add(tile)
        return tile
      })
    })
    this.scene.input.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (_: never, objects: Phaser.GameObjects.Sprite[]) => {
      if (objects.some(object => object instanceof Floor)) return
      this.scene.events.emit('background-click')
    })
  }

  addUnit(unit: Unit) {
    this.add(unit)
    this.unities.push(unit)
    const floor = this.tiles[unit.gridX]?.[unit.gridY]
    if (!floor) throw new Error("There's no floor for this unit")
    floor.addUnit(unit)
  }

  removeUnit(unit: Unit) {
    this.unities = this.unities.filter(boardUnit => boardUnit !== unit)
    unit.tile?.removeUnit()
  }

  paintMoves(tile: Tile) {
    if (!tile.unit) return
    const unit = tile.unit
    const color = unit.getController() === 'player'
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
    return this.tiles[endNode.x][endNode.y]
  }

  getTileAt(point: Phaser.Math.Vector2 | [number, number]): Tile | undefined {
    const tile = point instanceof Phaser.Math.Vector2
      ? this.tiles[point.x]?.[point.y]
      : this.tiles[point[0]]?.[point[1]]
    return tile
  }

  getUnitTile(unit: Unit) {
    return this.scene.board.tiles
      .flatMap(row => row)
      .find(tile => tile?.unit === unit)
  }

  buildUnitPathFinding(unit: Unit) {
    const pathFinding = new PathFinding(BOARD_SIZE, BOARD_SIZE)
    this.scene.board.tiles.forEach((row, x) => {
      row.forEach((tile, y) => {
        pathFinding.grid[x][y].isWalkable = tile.isWalkableBy(unit)
      })
    })
    return pathFinding
  }

  newTurn() {
    this.unities.forEach(unit => unit.newTurn())
  }

  getClosestUnitDistance(origin: Math.Vector2, notControlledBy: ControllerType): number | undefined {
    let lowestDistance: number | undefined
    this.unities.forEach(unit => {
      if (unit.getController() === notControlledBy) return
      const distance = unit.point
        .clone()
        .distance(origin)
      if (typeof lowestDistance === 'undefined') {
        lowestDistance = distance
        return
      }
      if (distance >= lowestDistance) return
      lowestDistance = distance
    })
    return lowestDistance
  }
}