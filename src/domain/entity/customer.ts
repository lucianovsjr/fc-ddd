import Address from "./address";
import EventDispatcher from "../event/@shared/event-dispatcher";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import CustomerAddressChangedEvent from "../event/customer/customer-address-changed.event";

export default class Customer {
    static _eventDispatcher: EventDispatcher;

    private _id: string;
    private _name: string = "";
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
        this.createdEvents();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    get Address(): Address {
        return this._address;
    }

    changeAddress(address: Address) {
        this._address = address;
        this.changedAdressEvents();
    }

    isActive(): boolean {
        return this._active;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    set Address(address: Address) {
        this._address = address;
    }

    createdEvents(): void {
        if (Customer._eventDispatcher) {
            const firstCustomerCreatedEvent = new CustomerCreatedEvent(this);
            const secondCustomerCreatedEvent = new CustomerCreatedEvent(this);

            Customer._eventDispatcher.notify(firstCustomerCreatedEvent);
            Customer._eventDispatcher.notify(secondCustomerCreatedEvent);
        }
    }

    changedAdressEvents(): void {
        if (Customer._eventDispatcher) {
            const customerAddressChangedEvent = new CustomerAddressChangedEvent(this);
            Customer._eventDispatcher.notify(customerAddressChangedEvent);
        }
    }
}