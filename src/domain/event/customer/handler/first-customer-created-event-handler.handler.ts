import EventHandlerInterface from "../../@shared/event-handler.interface";
import FirstCustomerCreatedEvent from "../first-customer-created.event";

export default class FirstCustomerCreatedEventHandler implements EventHandlerInterface<FirstCustomerCreatedEvent> {
    handle(event: FirstCustomerCreatedEvent): void {
        console.log("Esse é o primeiro console.log do evento: CustomerCreated");
    }
}