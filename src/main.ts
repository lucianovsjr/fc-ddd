import Customer from "./domain/entity/customer";
import Address from "./domain/entity/address";
import OrderItem from "./domain/entity/orderItem";
import Order from "./domain/entity/order";

const customer = new Customer("123", "Jr");
const address = new Address("Rua 123", 12, "25-25", "Xerem");
customer.changeAddress(address);
customer.activate();

// Relation between aggregate is with ID

// Relation: Entity object
const item1 = new OrderItem("1", "Item 1", 10, "p1", 1);
const item2 = new OrderItem("2", "Item 2", 15, "p1", 2);
const order = new Order("1", "123", [item1, item2]);
