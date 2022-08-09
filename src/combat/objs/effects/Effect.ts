import CombatScene from "../../scenes/CombatScene";

export abstract class Effect {
  constructor(public scene: CombatScene) {}

  abstract apply(): Promise<void>
}