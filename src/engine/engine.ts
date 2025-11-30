import { EventBus } from "./eventbus";

export interface Entity {
  id: string;
}

export interface State {
  entities: Record<string, Entity>;
}

export interface Event {
  type: string;
  payload?: any;
}

export type Command = (state: State) => State;

export type System = (state: State, event: Event) => Command[];

export class Engine {
  constructor(
    private state: State,
    private eventBus: EventBus,
    private systems: System[],
  ) {}

  dispatch(event: Event): void {
    this.eventBus.dispatch(event);
  }

  /**
   * Get a clone of the current game state
   *
   * Returns a shallow clone to prevent external code from mutating the internal state.
   *
   * @returns Cloned State object
   */
  getState(): State {
    return {
      entities: { ...this.state.entities },
    };
  }

  tick = (ticker: { deltaTime: number }) => {
    // Generate TICK event
    this.eventBus.dispatch({
      type: "TICK",
      payload: { deltaTime: ticker.deltaTime },
    });

    // Flush all events (including TICK)
    const events = this.eventBus.flush();

    // Process events
    for (const event of events) {
      const commands = this.processEvent(event);
      for (const command of commands) {
        this.state = command(this.state);
      }
    }
  };

  private processEvent = (event: Event): Command[] => {
    let commands: Command[] = [];
    for (const system of this.systems) {
      commands = commands.concat(system(this.state, event));
    }
    return commands;
  };
}
