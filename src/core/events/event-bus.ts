import { DomainEvent, DomainEventType } from "./domain-events";

type EventHandler<E extends DomainEvent = DomainEvent> = (event: E) => Promise<void> | void;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<DomainEventType, Set<EventHandler>> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe<E extends DomainEvent>(
    eventType: DomainEventType,
    handler: EventHandler<E>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    const eventHandlers = this.handlers.get(eventType)!;
    eventHandlers.add(handler as EventHandler);

    return () => {
      eventHandlers.delete(handler as EventHandler);
    };
  }

  public async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventType);
    if (!eventHandlers || eventHandlers.size === 0) {
      return;
    }

    const executions = Array.from(eventHandlers).map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[EventBus] Error executing handler for ${event.eventType}:`, error);
      }
    });

    await Promise.all(executions);
  }
}

export const domainEventBus = EventBus.getInstance();
