import { Effect } from "./effects/Effect"
import { Tile } from "./tiles/Tile"
import { ControllerType, Unit } from "./Unit"

export interface UnitActionParams {
  unit: Unit
  team: ControllerType
  startTile: Tile
  endTile: Tile
  targetTile?: Tile
  weaponIndex?: number
  effects?: Effect[]
}

export interface UnitAction extends UnitActionParams {
  effects: Effect[]
}

export class UnitAction {
  effects: Effect[] = []

  constructor(params: UnitActionParams) {
    Object.assign(this, params)
  }

  get distance() {
    return this.startTile.point.clone()
      .distance(this.endTile.point)
  }

  get isJustMovement() {
    return typeof this.weaponIndex === 'undefined'
  }
}
