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
  private eventQueue: Event[] = [];

  constructor(
    private state: State,
    private systems: System[],
  ) {}

  dispatch(event: Event): void {
    this.eventQueue.push(event);
  }

  tick = (ticker: { deltaTime: number }) => {
    const events = [
      ...this.eventQueue,
      { type: "TICK", payload: { deltaTime: ticker.deltaTime } },
    ];
    this.eventQueue = [];

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
