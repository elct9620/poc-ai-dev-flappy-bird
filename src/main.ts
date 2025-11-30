import "reflect-metadata";

import { Application } from "pixi.js";

import { Engine } from "@/engine/engine";
import "./style.css";

// Create PIXI application
const app = new Application();

// Initialize and mount
await app.init({
  resizeTo: window,
  background: "#1099bb",
  antialias: true,
  autoStart: false,
});

document.querySelector<HTMLDivElement>("#app")!.appendChild(app.canvas);

// Start game loop
const engine = new Engine({}, []);
app.ticker.add(engine.tick);
app.start();
