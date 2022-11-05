import express, { Request, Response } from "express";
import { CreateProductController } from "../controllers/product/create/create.product.controller";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const controller = new CreateProductController();
  await controller.execute(req, res);
});
