import { Application } from "pixi.js";
import "reflect-metadata";
import "./style.css";

// Create PIXI application
const app = new Application();

// Initialize and mount
await app.init({
  resizeTo: window,
  background: "#1099bb",
  antialias: true,
});

document.querySelector<HTMLDivElement>("#app")!.appendChild(app.canvas);
