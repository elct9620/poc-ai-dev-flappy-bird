import type { Event } from "@/events";

/**
 * EventBus manages the event queue for the game engine
 *
 * Responsibilities:
 * - Queue events via dispatch()
 * - Return and clear all events via flush()
 * - Maintain immutability (events are copied, not exposed directly)
 */
export class EventBus {
  private queue: Event[] = [];

  /**
   * Add an event to the queue
   * Events are processed in FIFO order during the next flush()
   */
  dispatch(event: Event): void {
    this.queue.push(event);
  }

  /**
   * Return all queued events and clear the queue
   * Returns a copy to prevent external mutation
   */
  flush(): Event[] {
    const events = [...this.queue];
    this.queue = [];
    return events;
  }

  /**
   * Get current queue length (useful for testing/debugging)
   */
  get length(): number {
    return this.queue.length;
  }
}
