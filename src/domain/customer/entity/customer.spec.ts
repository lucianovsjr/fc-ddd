import Customer from "./customer";
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import FirstCustomerCreatedEventHandler from "../event/customer/handler/first-customer-created-event-handler.handler";
import SecondCustomerCreatedEventHandler from "../event/customer/handler/second-customer-created-event-handler.handler";
import CustomerAddressChangedEventHandler from "../event/customer/handler/customer-address-changed-event-handler.handler";

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            const customer = new Customer("", "Jhon");
        }).toThrowError("Id is required");
    })

    it("should throw error when name is empty", () => {
        expect(() => {
            const customer = new Customer("123", "");
        }).toThrowError("Name is required");
    })

    it("should change name", () => {
        // Triple A:
        // Arrange
        const customer = new Customer("123", "Jhon");

        // Act
        customer.changeName("jane");

        // Assert
        expect(customer.name).toEqual("jane");
    })

    it("Should activate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(address);

        customer.activate();

        expect(customer.isActive()).toBe(true);
    })

    it("Should throw error when address is undefined when you activate a customer", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer")
    })

    it("Should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    })

    it("Should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })

    it("should send first customer creation event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new FirstCustomerCreatedEventHandler();

        Customer._eventDispatcher = eventDispatcher;

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        new Customer("1", "Customer 1");

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should send second customer creation event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SecondCustomerCreatedEventHandler();

        Customer._eventDispatcher = eventDispatcher;

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        new Customer("1", "Customer 1");

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should not send customer creation event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SecondCustomerCreatedEventHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        new Customer("1", "Customer 1");

        expect(spyEventHandler).not.toHaveBeenCalled();
    });


    it("should send customer adress changed event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new CustomerAddressChangedEventHandler();

        Customer._eventDispatcher = eventDispatcher;

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customer = new Customer("1", "Customer 1");

        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(address);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should not send customer adress changed event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new CustomerAddressChangedEventHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customer = new Customer("1", "Customer 1");

        const address = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(address);

        expect(spyEventHandler).not.toHaveBeenCalled();
    });
})