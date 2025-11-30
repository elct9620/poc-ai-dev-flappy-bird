import "reflect-metadata";

import { Application } from "pixi.js";

import { PixiInputAdapter } from "@/adapters/PixiInputAdapter";
import { PixiStageAdapter } from "@/adapters/PixiStageAdapter";
import { Engine } from "@/engine/engine";
import { createGameState } from "@/entity/GameState";
import { ScoreSystem } from "@/systems/ScoreSystem";
import { loadNumberAssets } from "@/utils/AssetLoader";
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

// Load assets
const numberTextures = await loadNumberAssets();

// Create adapter
const stageAdapter = new PixiStageAdapter(app, numberTextures);

// Create system with adapter
const scoreSystem = ScoreSystem(stageAdapter);

// Create initial state
const initialState = createGameState();

// Initialize engine
const engine = new Engine(initialState, [scoreSystem]);

// Connect to PixiJS ticker
app.ticker.add(engine.tick);
app.start();

// Demo: Create a score display
engine.dispatch({
  type: "CREATE_SCORE",
  payload: {
    id: "score",
    value: 42,
    position: { x: window.innerWidth / 2, y: 100 },
    scale: 2,
    spacing: 4,
    alignment: "center",
  },
});

// Setup input handling
const inputAdapter = new PixiInputAdapter(engine, app, "score");
