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
});
