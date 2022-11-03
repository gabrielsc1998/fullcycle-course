import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const currentOrder = await this.find(entity.id);

    if (currentOrder.items.length < entity.items.length) {
      const itemsToCreate = entity.items.filter(
        (item) => !currentOrder.items.some(({ id }) => id === item.id)
      );

      await OrderItemModel.bulkCreate(
        itemsToCreate.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: currentOrder.id,
        }))
      );
    }

    OrderModel.update(
      {
        ...currentOrder,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    try {
      const currentOrder = await OrderModel.findOne({
        where: {
          id: id,
        },
        rejectOnEmpty: true,
        include: [{ model: OrderItemModel }],
      });

      const items = currentOrder.items.map((item) => this.buildOrderItem(item));
      return new Order(currentOrder.id, currentOrder.customer_id, items);
    } catch {
      throw new Error("Order not found");
    }
  }

  async findAll(): Promise<Order[]> {
    const orders = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return orders.map((order) => {
      const items = order.items.map((item) => this.buildOrderItem(item));
      return new Order(order.id, order.customer_id, items);
    });
  }

  private buildOrderItem(item: OrderItemModel): OrderItem {
    return new OrderItem(
      item.id,
      item.name,
      item.price / item.quantity,
      item.product_id,
      item.quantity
    );
  }
}
