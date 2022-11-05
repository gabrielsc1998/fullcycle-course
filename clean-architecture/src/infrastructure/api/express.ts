import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";

import CustomerModel from "../customer/repository/sequelize/customer.model";
import ProductModel from "../product/repository/sequelize/product.model";

import { productRoute } from "./routes/product.route";
import { customerRoute } from "./routes/customer.route";

export const app: Express = express();

app.use(express.json());

app.use("/customer", customerRoute);
app.use("/product", productRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  loadModels();
  await sequelize.sync();
}

const loadModels = (): void => {
  sequelize.addModels([CustomerModel, ProductModel]);
};

setupDb();
