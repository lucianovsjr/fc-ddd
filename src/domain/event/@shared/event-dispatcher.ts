import EventDispatcherInterface from "./event-dispatcher.interface";
import EventHandlerInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default class EventDispatcher implements EventDispatcherInterface {
    register(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {

    }

    unregister(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {

    }

    unregisterAll(): void {

    }

    notify(event: EventInterface): void {

    }
}