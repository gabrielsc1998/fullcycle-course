import { DBSequelizeConnection } from "../../../common/test/db/db-sequelize.connection";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

import CreateProductUseCase from "./create.product.usecase";

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: CreateProductUseCase;
};

const makeSut = (): SUT => {
  const productRepository = new ProductRepository();
  const productCreateUseCase = new CreateProductUseCase(productRepository);

  return {
    repository: productRepository,
    useCase: productCreateUseCase,
  };
};

let sut: SUT = null;

const input = {
  name: "computer",
  price: 200,
};

describe("Create Product Use Case  [ integration ]", () => {
  let dbClient: DBSequelizeConnection;

  beforeAll(() => (sut = makeSut()));

  beforeEach(async () => {
    dbClient = new DBSequelizeConnection();
    await dbClient.initialize([ProductModel]);
  });

  afterEach(async () => {
    await dbClient.close();
  });

  it("should create a product", async () => {
    const output = await sut.useCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });

    const storedProduct = await sut.repository.find(output.id);

    expect(output.id).toEqual(storedProduct.id);
    expect(output.name).toEqual(storedProduct.name);
    expect(output.price).toEqual(storedProduct.price);
  });

  it("should thrown an error when name is missing", async () => {
    const spyRepository = jest.spyOn(sut.repository, "create");

    await expect(sut.useCase.execute({ ...input, name: "" })).rejects.toThrow(
      "product: Name is required"
    );

    expect(spyRepository).not.toBeCalled();
  });

  it("should thrown an error when the price is less than zero", async () => {
    const spyRepository = jest.spyOn(sut.repository, "create");

    await expect(sut.useCase.execute({ ...input, price: -1 })).rejects.toThrow(
      "product: Price must be greater than zero"
    );

    expect(spyRepository).not.toBeCalled();
  });

  it("should throw an error when all data is invalid", async () => {
    await expect(sut.useCase.execute({ name: "", price: -1 })).rejects.toThrow(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
