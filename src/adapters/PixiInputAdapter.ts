import type { Application } from "pixi.js";

import type { EventBus } from "@/engine/eventbus";
import { SystemEventType } from "@/events";

/**
 * PixiInputAdapter handles user input events and translates them to game events
 *
 * Responsibilities:
 * - Listen to PixiJS stage pointer events for clicks
 * - Listen to document keyboard events for spacebar
 * - Dispatch MOUSE_CLICK and KEY_DOWN events for game systems to handle
 */
export class PixiInputAdapter {
  private boundHandlePointer: (e: PointerEvent) => void;
  private boundHandleKeydown: (e: KeyboardEvent) => void;

  constructor(
    private eventBus: EventBus,
    private app: Application,
  ) {
    // Bind methods to preserve context
    this.boundHandlePointer = this.handlePointer.bind(this);
    this.boundHandleKeydown = this.handleKeydown.bind(this);

    // Enable interaction on stage
    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;

    // Listen to PixiJS pointer events
    this.app.stage.on("pointerdown", this.boundHandlePointer);

    // Listen to keyboard events on document
    document.addEventListener("keydown", this.boundHandleKeydown);
  }

  private handlePointer(e: PointerEvent): void {
    this.eventBus.dispatch({
      type: SystemEventType.MouseClick,
      payload: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault(); // Prevent page scroll
      this.eventBus.dispatch({
        type: SystemEventType.KeyDown,
        payload: {
          key: "Space",
        },
      });
    }
  }

  destroy(): void {
    this.app.stage.off("pointerdown", this.boundHandlePointer);
    document.removeEventListener("keydown", this.boundHandleKeydown);
  }
}
