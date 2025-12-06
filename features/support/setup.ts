import { setWorldConstructor } from "quickpickle";
import { GameWorld } from "./world";

// Import step definitions
import "../steps/pipe.steps";

// Register custom world constructor
setWorldConstructor(GameWorld);
