import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        const customer = CustomerFactory.create("Jhon");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Jhon");
        expect(customer.address).toBeUndefined();
    });

    it("customer create a customer with an address", () => {
        const address = new Address("Street", 1, "25555-25", "São Paulo");
        const customer = CustomerFactory.createWithAddress("Jhon", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Jhon");
        expect(customer.address).toBe(address);
    });
});