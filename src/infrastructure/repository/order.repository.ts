import Order from "../../domain/checkout/entity/order";
import OrderItem from "../../domain/checkout/entity/orderItem";
import OrderRepositoryInterface from "../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            }))
        },
            {
                include: [{ model: OrderItemModel }],
            });
    }

    async update(entity: Order): Promise<void> {
        const itemExistingIds = entity.items.map(({ id }) => id);
        const itemsMustRemoved = await OrderItemModel.findAll({ where: { order_id: entity.id } });
        itemsMustRemoved.forEach(async item => {
            if (!itemExistingIds.includes(item.id)) {
                item.destroy();
            }
        });

        entity.items.forEach(async (item: OrderItem) => {
            const findedItem = await OrderItemModel.findOne({ where: { id: item.id } });
            if (findedItem) {
                await OrderItemModel.update(
                    {
                        product_id: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    },
                    {
                        where: {
                            id: item.id,
                        },
                    }
                );
            } else {
                await OrderItemModel.create({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                    order_id: entity.id,
                })
            }
        })

        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                }))
            },
            {
                where: {
                    id: entity.id,
                },
            }
        );
    }

    async find(id: string): Promise<Order> {
        let order;
        try {
            order = await OrderModel.findOne({ where: { id: id }, include: OrderItemModel });
        } catch (error) {
            throw new Error("Order not found");
        }
        const items = order.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));

        return new Order(order.id, order.customer_id, items);
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({ include: OrderItemModel });

        const orders = orderModels.map((orderModel) => {
            const items = orderModel.items.map(item => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
            return new Order(orderModel.id, orderModel.customer_id, items);
        });

        return orders;
    }
}