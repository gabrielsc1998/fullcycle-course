import express, { Request, Response } from "express";

import { FindProductController } from "../controllers/product/find/find.product.controller";
import { ListProductsController } from "../controllers/product/list/list.products.controller";
import { CreateProductController } from "../controllers/product/create/create.product.controller";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const controller = new CreateProductController();
  await controller.execute(req, res);
});

productRoute.get("/", async (req: Request, res: Response) => {
  const controller = new ListProductsController();
  await controller.execute(req, res);
});

productRoute.get("/:id", async (req: Request, res: Response) => {
  const controller = new FindProductController();
  await controller.execute(req, res);
});
