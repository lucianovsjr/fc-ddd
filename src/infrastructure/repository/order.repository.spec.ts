import { Sequelize } from "sequelize-typescript";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/orderItem";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Street 1", 1, "Zip 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual(order.toObject());

    });

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Street 1", 1, "Zip 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const newCustomer = new Customer("2", "Maria");
        newCustomer.changeAddress(address);
        await customerRepository.create(newCustomer);
        order.changeCustomerId(newCustomer.id);

        await orderRepository.update(order);
        const customerIdChangedOrderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(customerIdChangedOrderModel.toJSON()).toStrictEqual(order.toObject());

        const newOrderItem = new OrderItem("2", product.name, product.price, product.id, 2);
        order.changeItems([orderItem, newOrderItem]);

        await orderRepository.update(order);
        const itemAddedInOrderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(itemAddedInOrderModel.toJSON()).toStrictEqual(order.toObject());

        newOrderItem.changePrice(11);
        order.changeItems([orderItem, newOrderItem]);
        await orderRepository.update(order);
        const itemChangedInOrderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(itemChangedInOrderModel.toJSON()).toStrictEqual(order.toObject());

        order.changeItems([newOrderItem]);
        await orderRepository.update(order);
        const itemRemovedInOrderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(itemRemovedInOrderModel.toJSON()).toStrictEqual(order.toObject());
    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Street 1", 1, "Zip 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("123", customer.id, [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);
    });

    it("should throw an error when order is not found", async () => {
        const orderRepository = new OrderRepository();

        expect(async () => {
            await orderRepository.find("123Z");
        }).rejects.toThrow("Order not found");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("1", "Jhon");
        const address = new Address("Street 1", 1, "Zip 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("a1", product.name, product.price, product.id, 2);
        const orderItem2 = new OrderItem("b1", product.name, product.price, product.id, 2);

        const orderRepository = new OrderRepository();
        const order = new Order("123", customer.id, [orderItem]);
        const order2 = new Order("456", customer.id, [orderItem2]);
        await orderRepository.create(order);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order);
        expect(orders).toContainEqual(order2);
    });
});
