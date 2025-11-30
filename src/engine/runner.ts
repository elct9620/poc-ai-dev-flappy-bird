import * as PIXI from "pixi.js";

export class Runner {
  constructor(private app: PIXI.Application) {
    this.app.ticker.add(this.tick);
  }

  public start() {
    this.app.start();
  }

  private tick = () => {};
}
