import "reflect-metadata";

import { Application } from "pixi.js";

import { BrowserAudioAdapter } from "@/adapters/BrowserAudioAdapter";
import { PixiInputAdapter } from "@/adapters/PixiInputAdapter";
import { PixiStageAdapter } from "@/adapters/PixiStageAdapter";
import { Engine } from "@/engine/engine";
import { EventBus } from "@/engine/eventbus";
import { createGameState } from "@/entity/GameState";
import { GameEventType, SystemEventType } from "@/events";
import { AudioSystem } from "@/systems/AudioSystem";
import { BackgroundSystem } from "@/systems/BackgroundSystem";
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

// Create adapters
const stageAdapter = new PixiStageAdapter(
  app,
  numberTextures,
  birdTextures,
  backgroundTexture,
  groundTexture,
  pipeTexture,
);
const audioAdapter = new BrowserAudioAdapter();

// Preload sound effects
// Use Vite's asset URL handling to get the correct bundled path
const wingAudioUrl = new URL("./assets/soundEffects/wing.ogg", import.meta.url)
  .href;
await audioAdapter.preloadSound("wing", wingAudioUrl);

// Create systems with adapters
const backgroundSystem = BackgroundSystem(stageAdapter);
const groundSystem = GroundSystem(stageAdapter);
const scoreSystem = ScoreSystem(stageAdapter);
const physicsSystem = PhysicsSystem(stageAdapter);
const pipeSystem = PipeSystem(stageAdapter);
const audioSystem = AudioSystem(audioAdapter);

// Create initial state
const initialState = createGameState();

// Create event bus
const eventBus = new EventBus();

// Create input system (needs event bus to dispatch BIRD_FLAP)
const inputSystem = InputSystem(eventBus, "bird");

// Initialize engine with all systems
const engine = new Engine(initialState, eventBus, [
  backgroundSystem,
  groundSystem,
  pipeSystem,
  scoreSystem,
  physicsSystem,
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

// Pipe generation configuration
const MIN_GAP_SIZE = 100;
const MAX_GAP_SIZE = 120;
const MIN_GAP_Y = 100;
const MAX_GAP_Y = 300;
const PIPE_SPACING = 200;
const PIPE_SCROLL_SPEED = 2;

// Helper function to generate random gap size and position
function generatePipeParams() {
  const gapSize = MIN_GAP_SIZE + Math.random() * (MAX_GAP_SIZE - MIN_GAP_SIZE);
  const gapY = MIN_GAP_Y + Math.random() * (MAX_GAP_Y - MIN_GAP_Y);
  return { gapSize, gapY };
}

// Track pipe generation state
let pipeCounter = 0;
let lastPipeX = window.innerWidth;

// Function to spawn a new pipe pair
function spawnPipePair() {
  const { gapSize, gapY } = generatePipeParams();
  const x = lastPipeX + PIPE_SPACING;

  engine.dispatch({
    type: GameEventType.CreatePipe,
    payload: {
      topId: `pipe-top-${pipeCounter}`,
      bottomId: `pipe-bottom-${pipeCounter}`,
      x,
      gapY,
      gapSize,
    },
  });

  lastPipeX = x;
  pipeCounter++;
}

// Create initial pipe pairs
for (let i = 0; i < 3; i++) {
  spawnPipePair();
}

// Continuous pipe generation - spawn new pipe when the last one moves into view
app.ticker.add(() => {
  // When the last pipe has scrolled enough, spawn a new one
  const distanceFromEdge = lastPipeX - window.innerWidth;
  if (distanceFromEdge < PIPE_SPACING) {
    spawnPipePair();
  }

  // Update lastPipeX based on scroll speed
  lastPipeX -= PIPE_SCROLL_SPEED;
});

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
