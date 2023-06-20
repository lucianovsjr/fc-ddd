import EventHandlerInterface from "../../@shared/event-handler.interface";
import SecondCustomerCreatedEvent from "../second-customer-created.event";

export default class FirstCustomerCreatedEventHandler2 implements EventHandlerInterface<SecondCustomerCreatedEvent> {
    handle(event: SecondCustomerCreatedEvent): void {
        console.log("Esse é o segundo console.log do evento: CustomerCreated");
    }
}