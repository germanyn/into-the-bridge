import { BOARD_SIZE } from "../constants"
import MainScene from "../scenes/Game"
import { Floor } from "./tiles/Floor"
import { IsometricSprite } from "./IsometricSprite"
import { Unit } from "./Unit"

export class Board {

  floors: Floor[][]
  unities: IsometricSprite[] = []

  constructor(scene: MainScene) {
    this.floors = Array.from(Array(BOARD_SIZE), (_, x) => {
      return Array.from(Array(BOARD_SIZE), (_, y) => {
        const tile = new Floor(scene, x, y)
        tile.setInteractive()
        return tile
      })
    })
  }

  addUnit(unit: Unit) {
    this.unities.push(unit)
    this.floors[unit.gridX][unit.gridY].unit = unit
  }
}