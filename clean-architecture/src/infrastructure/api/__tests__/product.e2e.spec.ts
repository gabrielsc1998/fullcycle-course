import request from "supertest";

import { app, sequelize } from "../express";

const BASE_ROUTE = "/product";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("When call the create product endpoint", () => {
    it("should create a product", async () => {
      const body = {
        name: "product-name",
        price: 100,
      };

      const response = await request(app).post(BASE_ROUTE).send(body);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(body.name);
      expect(response.body.price).toBe(body.price);
    });

    it("should return 500 when the name is null", async () => {
      const response = await request(app).post(BASE_ROUTE).send({
        name: null,
      });
      expect(response.status).toBe(500);
    });

    it("should return 500 when the price is null", async () => {
      const response = await request(app).post(BASE_ROUTE).send({
        name: "product-name",
        price: null,
      });
      expect(response.status).toBe(500);
    });
  });

  describe("When call the list products endpoint", () => {
    it("should list all products", async () => {
      const bodyProduct1 = {
        name: "product-name-1",
        price: 100,
      };
      await request(app).post(BASE_ROUTE).send(bodyProduct1);

      const bodyProduct2 = {
        name: "product-name-2",
        price: 100,
      };
      await request(app).post(BASE_ROUTE).send(bodyProduct2);

      const response = await request(app).get(BASE_ROUTE);

      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(2);

      const product = response.body.products[0];
      expect(product.name).toBe(bodyProduct1.name);
      expect(product.price).toBe(bodyProduct1.price);
      const product2 = response.body.products[1];
      expect(product2.name).toBe(bodyProduct2.name);
      expect(product2.price).toBe(bodyProduct2.price);
    });

    it("should get an empty array when the database is empty", async () => {
      const response = await request(app).get(BASE_ROUTE);

      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(0);
    });
  });
});
