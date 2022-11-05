import { Request, Response } from "express";

import ListProductsUseCase from "../../../../../usecase/product/list/list.product.usecase";
import ProductRepository from "../../../../product/repository/sequelize/product.repository";

import { Controller } from "../../contracts/controler.interface";

const makeUseCase = (): ListProductsUseCase => {
  const productRepository = new ProductRepository();
  const useCase = new ListProductsUseCase(productRepository);
  return useCase;
};

export class ListProductsController implements Controller {
  async execute(req: Request, res: Response): Promise<void> {
    const useCase = makeUseCase();
    try {
      const output = await useCase.execute({});
      res.status(200).send(output);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
