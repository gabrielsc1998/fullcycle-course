import { Request, Response } from "express";
import { InputFindProductDto } from "../../../../../usecase/product/find/find.product.dto";

import FindProductUseCase from "../../../../../usecase/product/find/find.product.usecase";
import ProductRepository from "../../../../product/repository/sequelize/product.repository";

import { Controller } from "../../contracts/controler.interface";

const makeUseCase = (): FindProductUseCase => {
  const productRepository = new ProductRepository();
  const useCase = new FindProductUseCase(productRepository);
  return useCase;
};

export class FindProductController implements Controller {
  async execute(req: Request, res: Response): Promise<void> {
    const useCase = makeUseCase();
    try {
      const findProductDto: InputFindProductDto = {
        id: req.params.id,
      };
      const output = await useCase.execute(findProductDto);
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
