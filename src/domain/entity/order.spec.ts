import Order from "./order";
import OrderItem from "./orderItem";

describe("Order unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            const order = new Order("", "123", []);
        }).toThrowError("Id is required");
    })

    it("should throw error when customerId is empty", () => {
        expect(() => {
            const order = new Order("123", "", []);
        }).toThrowError("CustomerId is required");
    })

    it("should throw error when Items is empty", () => {
        expect(() => {
            const order = new Order("123", "123", []);
        }).toThrowError("Items are required");
    })

    it("should calculate total", () => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
        const order = new Order("o1", "c1", [item]);

        let total = order.total();

        expect(total).toBe(200);

        const order2 = new Order("o2", "c2", [item, item2]);
        total = order2.total();

        expect(total).toBe(600);
    })

    it("should throw error if the item qte is greater than 0", () => {
        expect(() => {
            const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
            const order = new Order("o1", "c1", [item]);
        }).toThrowError("Quantity must be greater than 0");
    })

    it("should change customer id", () => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const order = new Order("o1", "c1", [item]);

        order.changeCustomerId("c2");

        expect(order.customerId).toBe("c2");
    })

    it("should change items", () => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const order = new Order("o1", "c1", [item]);

        const item2 = new OrderItem("i2", "Item 2", 100, "p2", 4);
        const newItems = [item2];

        order.changeItems(newItems);

        expect(order.items).toBe(newItems);
        expect(order.total()).toBe(400);
    })
})