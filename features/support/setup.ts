import { setWorldConstructor } from "quickpickle";
import { GameWorld } from "./world";

// Register custom world constructor
setWorldConstructor(GameWorld);
