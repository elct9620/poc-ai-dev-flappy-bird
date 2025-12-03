import type { Application } from "pixi.js";

/**
 * PixiInputAdapter handles browser input events using PixiJS and DOM APIs.
 * Provides callback-based interface for loose coupling with input systems.
 *
 * Responsibilities:
 * - Listen to PixiJS stage pointer events for clicks
 * - Listen to document keyboard events for spacebar
 * - Invoke registered callbacks when events occur
 * - Provide cleanup method to remove all listeners
 *
 * @see {@link ../../docs/design/system/input_system.md|Input System Design Document}
 */
export class PixiInputAdapter {
  private boundHandlePointer: (e: PointerEvent) => void;
  private boundHandleKeydown: (e: KeyboardEvent) => void;
  private mouseClickCallback?: (x: number, y: number) => void;
  private keyDownCallback?: (key: string) => void;

  constructor(private app: Application) {
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

  onMouseClick(callback: (x: number, y: number) => void): void {
    this.mouseClickCallback = callback;
  }

  onKeyDown(callback: (key: string) => void): void {
    this.keyDownCallback = callback;
  }

  removeListeners(): void {
    this.app.stage.off("pointerdown", this.boundHandlePointer);
    document.removeEventListener("keydown", this.boundHandleKeydown);
    this.mouseClickCallback = undefined;
    this.keyDownCallback = undefined;
  }

  private handlePointer(e: PointerEvent): void {
    if (this.mouseClickCallback) {
      this.mouseClickCallback(e.clientX, e.clientY);
    }
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault(); // Prevent page scroll
      if (this.keyDownCallback) {
        this.keyDownCallback("Space");
      }
    }
  }

  destroy(): void {
    this.removeListeners();
  }
}
