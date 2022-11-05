import { Request, Response } from "express";

import ProductRepository from "../../../../product/repository/sequelize/product.repository";
import UpdateProductUseCase from "../../../../../usecase/product/update/update.product.usecase";
import { InputUpdateProductDto } from "../../../../../usecase/product/update/update.product.dto";

import { Controller } from "../../contracts/controler.interface";

const makeUseCase = (): UpdateProductUseCase => {
  const productRepository = new ProductRepository();
  const useCase = new UpdateProductUseCase(productRepository);
  return useCase;
};

export class UpdateProductController implements Controller {
  async execute(req: Request, res: Response): Promise<void> {
    const useCase = makeUseCase();
    try {
      const updateProductDto: InputUpdateProductDto = {
        id: req.body.id,
        name: req.body?.name,
        price: typeof req.body?.price === "number" ? req.body.price : undefined,
      };
      const output = await useCase.execute(updateProductDto);
      res.status(200).send(output);
    } catch (err: any) {
      let status = 500;
      if (err?.message === "Product not found") {
        status = 404;
      }
      res.status(status).send({ message: err?.message });
    }
  }
}
