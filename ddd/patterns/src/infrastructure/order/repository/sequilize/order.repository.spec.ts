import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

const makeCustomer = async (id: string): Promise<void> => {
  const customerRepository = new CustomerRepository();
  const customer = new Customer(id, "Customer 1");
  const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  customer.changeAddress(address);
  await customerRepository.create(customer);
};

const makeProduct = async (id: string): Promise<Product> => {
  const productRepository = new ProductRepository();
  const product = new Product(id, "Product 1", 10);
  await productRepository.create(product);
  return product;
};

const makeOrderItem = (
  id: string,
  product: Product,
  quantity: number
): OrderItem => {
  return new OrderItem(id, product.name, product.price, product.id, quantity);
};

const makeOrder = async (
  id: string,
  customerId: string,
  items: OrderItem[]
): Promise<Order> => {
  const order = new Order(id, customerId, items);
  const orderRepository = new OrderRepository();
  await orderRepository.create(order);
  return order;
};

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update the order [ add an item ]", async () => {
    const customerId = "123456";
    await makeCustomer(customerId);

    const productId = "123456";
    const product = await makeProduct(productId);
    const ordemItem = makeOrderItem("1", product, 2);

    const orderId = "123456";
    const order = await makeOrder(orderId, customerId, [ordemItem]);

    const product2Id = "010101";
    const product2 = await makeProduct(product2Id);
    const ordemItem2 = makeOrderItem("2", product2, 10);

    order.addItem(ordemItem2);

    const orderRepository = new OrderRepository();
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: orderId,
      customer_id: customerId,
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: orderId,
          product_id: product.id,
        },
        {
          id: ordemItem2.id,
          name: ordemItem2.name,
          price: ordemItem2.price,
          quantity: ordemItem2.quantity,
          order_id: orderId,
          product_id: product2.id,
        },
      ],
    });
  });

  it("should throw an error when try to update an inexistent order", async () => {
    const customerId = "123456";
    await makeCustomer(customerId);

    const productId = "123456";
    const product = await makeProduct(productId);
    const ordemItem = makeOrderItem("1", product, 2);

    expect(async () => {
      const orderRepository = new OrderRepository();
      await orderRepository.update(
        new Order("order-not-stored-id", customerId, [ordemItem])
      );
    }).rejects.toThrow("Order not found");
  });

  it("should throw an error when find an inexistent order", async () => {
    expect(async () => {
      const orderRepository = new OrderRepository();
      await orderRepository.find("order-not-stored-id");
    }).rejects.toThrow("Order not found");
  });

  it("should find an order", async () => {
    const customerId = "customer-id";
    await makeCustomer(customerId);

    const productId = "product-id";
    const product = await makeProduct(productId);
    const ordemItem = makeOrderItem("order-item-id", product, 2);

    const orderId = "order-id";
    const order = await makeOrder(orderId, customerId, [ordemItem]);

    const orderRepository = new OrderRepository();
    const getOrder = await orderRepository.find(orderId);

    expect(order).toStrictEqual(getOrder);
  });

  it("should get all orders", async () => {
    const customerId = "customer-id";
    await makeCustomer(customerId);

    const product = await makeProduct("product-id");

    const ordemItem = makeOrderItem("order-item-id", product, 2);

    const orderId = "order-id";
    const order = await makeOrder(orderId, customerId, [ordemItem]);

    const ordemItem2 = makeOrderItem("order-item-id-2", product, 2);

    const orderId2 = "order-id-2";
    const order2 = await makeOrder(orderId2, customerId, [ordemItem2]);

    const orderRepository = new OrderRepository();
    const orders = await orderRepository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(order2);
  });

  it("should received an empty array when the base is empty", async () => {
    const orderRepository = new OrderRepository();
    const orders = await orderRepository.findAll();
    expect(orders).toEqual([]);
  });
});
