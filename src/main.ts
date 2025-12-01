import "reflect-metadata";

import { Application } from "pixi.js";

import { PixiInputAdapter } from "@/adapters/PixiInputAdapter";
import { PixiStageAdapter } from "@/adapters/PixiStageAdapter";
import { Engine } from "@/engine/engine";
import { EventBus } from "@/engine/eventbus";
import { createGameState } from "@/entity/GameState";
import { InputSystem } from "@/systems/InputSystem";
import { PhysicsSystem } from "@/systems/PhysicsSystem";
import { ScoreSystem } from "@/systems/ScoreSystem";
import { loadBirdAssets, loadNumberAssets } from "@/utils/AssetLoader";
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
const birdTextures = await loadBirdAssets();

// Create adapter
const stageAdapter = new PixiStageAdapter(app, numberTextures, birdTextures);

// Create systems with adapter
const scoreSystem = ScoreSystem(stageAdapter);
const physicsSystem = PhysicsSystem(stageAdapter);

// Create initial state
const initialState = createGameState();

// Create event bus
const eventBus = new EventBus();

// Create input system (needs event bus to dispatch BIRD_FLAP)
const inputSystem = InputSystem(eventBus, "bird");

// Initialize engine with all systems
const engine = new Engine(initialState, eventBus, [
  scoreSystem,
  physicsSystem,
  inputSystem,
]);

// Connect to PixiJS ticker
app.ticker.add(engine.tick);
app.start();

// Demo: Create a score display
engine.dispatch({
  type: "CREATE_SCORE",
  payload: {
    id: "score",
    value: 0,
    position: { x: window.innerWidth / 2, y: 100 },
    scale: 2,
    spacing: 4,
    alignment: "center",
  },
});

// Create the bird
engine.dispatch({
  type: "CREATE_BIRD",
  payload: {
    id: "bird",
    position: { x: window.innerWidth / 4, y: window.innerHeight / 2 },
  },
});

// Setup input handling
new PixiInputAdapter(eventBus, app);
