import { Application } from "pixi.js";
import "reflect-metadata";
import { Runner } from "./engine/runner";
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
const runner = new Runner(app);
runner.start();
