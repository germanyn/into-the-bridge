import { Tile } from "../tiles/Tile";

export abstract class Effect {
  abstract apply(): Promise<void>
}