import "reflect-metadata";

import { Application } from "pixi.js";

import { BrowserAudioAdapter } from "@/adapters/BrowserAudioAdapter";
import { PixiInputAdapter } from "@/adapters/PixiInputAdapter";
import { PixiStageAdapter } from "@/adapters/PixiStageAdapter";
import { Engine } from "@/engine/engine";
import { EventBus } from "@/engine/eventbus";
import { GameEventType, SystemEventType } from "@/events";
import { registerRenderers } from "@/renderers";
import { RendererFactory } from "@/renderers/RendererFactory";
import { AudioSystem } from "@/systems/AudioSystem";
import { BackgroundSystem } from "@/systems/BackgroundSystem";
import { CollisionSystem } from "@/systems/CollisionSystem";
import { GroundSystem } from "@/systems/GroundSystem";
import { InputSystem } from "@/systems/InputSystem";
import { PhysicsSystem } from "@/systems/PhysicsSystem";
import { PipeSystem } from "@/systems/PipeSystem";
import { ScoreSystem } from "@/systems/ScoreSystem";
import {
  loadBackgroundAssets,
  loadBirdAssets,
  loadGroundAssets,
  loadNumberAssets,
  loadPipeAssets,
} from "@/utils/AssetLoader";
import { ScaleCalculator } from "@/utils/ScaleCalculator";
import "./style.css";

// Create PIXI application
const app = new Application();

// Initialize and mount
await app.init({
  resizeTo: window,
  background: "#6ebfc8",
  antialias: true,
  autoStart: false,
});

document.querySelector<HTMLDivElement>("#app")!.appendChild(app.canvas);

// Load assets
const numberTextures = await loadNumberAssets();
const birdTextures = await loadBirdAssets();
const backgroundTexture = await loadBackgroundAssets();
const groundTexture = await loadGroundAssets();
const pipeTexture = await loadPipeAssets();

// Create scale calculator for responsive rendering
const scaleCalculator = new ScaleCalculator(
  app.screen.width,
  app.screen.height,
);

// Create and configure renderer factory
const rendererFactory = new RendererFactory(
  numberTextures,
  birdTextures,
  backgroundTexture,
  groundTexture,
  pipeTexture,
  scaleCalculator,
);

// Register all entity types with their renderer configs
registerRenderers(rendererFactory);

// Create adapters
const stageAdapter = new PixiStageAdapter(app, rendererFactory);
const audioAdapter = new BrowserAudioAdapter();

// Preload sound effects
// Use Vite's asset URL handling to get the correct bundled path
try {
  const wingAudioUrl = new URL(
    "./assets/soundEffects/wing.ogg",
    import.meta.url,
  ).href;
  await audioAdapter.preloadSound("wing", wingAudioUrl);

  const pointAudioUrl = new URL(
    "./assets/soundEffects/point.ogg",
    import.meta.url,
  ).href;
  await audioAdapter.preloadSound("point", pointAudioUrl);
} catch (error) {
  console.warn("Failed to preload sound effects:", error);
  // Continue game initialization even if audio fails
}

// Create initial state with pipe generation enabled
// Setting lastPipeX to (width - 600) triggers automatic pipe spawning on first few ticks
const initialState = {
  entities: {},
  pipeGeneration: {
    counter: 0,
    lastPipeX: window.innerWidth - 600,
    screenWidth: window.innerWidth,
  },
};

// Create event bus
const eventBus = new EventBus();

// Create systems with adapters
const backgroundSystem = BackgroundSystem(stageAdapter);
const groundSystem = GroundSystem(stageAdapter);
const scoreSystem = ScoreSystem(stageAdapter);
const physicsSystem = PhysicsSystem(stageAdapter);
const pipeSystem = PipeSystem(stageAdapter, eventBus);
const collisionSystem = CollisionSystem(stageAdapter, eventBus);
const audioSystem = AudioSystem(audioAdapter);

// Create input system (needs event bus to dispatch BIRD_FLAP)
const inputSystem = InputSystem(eventBus, "bird");

// Initialize engine with all systems
const engine = new Engine(initialState, eventBus, [
  backgroundSystem,
  groundSystem,
  pipeSystem,
  scoreSystem,
  physicsSystem,
  collisionSystem,
  inputSystem,
  audioSystem,
]);

// Connect to PixiJS ticker
app.ticker.add(engine.tick);
app.start();

// Create the background
engine.dispatch({
  type: GameEventType.CreateBackground,
  payload: {
    id: "background",
  },
});

// Create the ground
engine.dispatch({
  type: GameEventType.CreateGround,
  payload: {
    id: "ground",
  },
});

// Demo: Create a score display
engine.dispatch({
  type: GameEventType.CreateScore,
  payload: {
    id: "score",
    value: 0,
    position: { x: window.innerWidth / 2, y: 100 },
    spacing: 4,
    alignment: "center",
  },
});

// Create the bird
engine.dispatch({
  type: GameEventType.CreateBird,
  payload: {
    id: "bird",
    position: { x: window.innerWidth / 4, y: window.innerHeight / 2 },
  },
});

// Note: Pipe generation is now handled automatically by PipeSystem via TICK events
// No manual pipe creation or ticker callbacks needed here

// Setup input handling with callback pattern
const inputAdapter = new PixiInputAdapter(app);

// Register callbacks that dispatch events to EventBus
inputAdapter.onMouseClick((x, y) => {
  eventBus.dispatch({
    type: SystemEventType.MouseClick,
    payload: { x, y },
  });
});

inputAdapter.onKeyDown((key) => {
  eventBus.dispatch({
    type: SystemEventType.KeyDown,
    payload: { key },
  });
});
