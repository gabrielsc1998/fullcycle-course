import { Request, Response } from "express";
import ProductRepository from "../../../../product/repository/sequelize/product.repository";
import CreateProductUseCase from "../../../../../usecase/product/create/create.product.usecase";
import { InputCreateProductDto } from "../../../../../usecase/product/create/create.product.dto";

import { Controller } from "../../contracts/controler.interface";

const makeUseCase = (): CreateProductUseCase => {
  const productRepository = new ProductRepository();
  const useCase = new CreateProductUseCase(productRepository);
  return useCase;
};

export class CreateProductController implements Controller {
  async execute(req: Request, res: Response): Promise<void> {
    const useCase = makeUseCase();
    try {
      const createProductDto: InputCreateProductDto = {
        name: req.body.name,
        price: req.body.price,
      };
      const output = await useCase.execute(createProductDto);
      res.status(201).send(output);
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
