import { Tile } from "../tiles/Tile";

export abstract class Effect {
  constructor(public tile?: Tile) {
    
  }
  abstract apply(): Promise<void>
}