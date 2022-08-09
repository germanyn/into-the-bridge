import MainScene from "../../scenes/GameScene";

export abstract class Effect {
  constructor(public scene: MainScene) {}

  abstract apply(): Promise<void>
}