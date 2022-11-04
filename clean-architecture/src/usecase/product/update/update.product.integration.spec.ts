import Product from "../../../domain/product/entity/product";
import { DBSequelizeConnection } from "../../../common/test/db/db-sequelize.connection";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

import UpdateProductUseCase from "./update.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const productMock = {
  id: "product-id",
  name: "product-name",
  price: 10,
};

const input = {
  id: productMock.id,
  name: "new-product-name",
  price: 20,
};

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: UpdateProductUseCase;
};

const makeSut = (): SUT => {
  const productRepository = new ProductRepository();
  const productUpdateUseCase = new UpdateProductUseCase(productRepository);

  return {
    repository: productRepository,
    useCase: productUpdateUseCase,
  };
};

let sut: SUT = null;

describe("Update Product Use Case [ integration ]", () => {
  let dbClient: DBSequelizeConnection;

  beforeAll(() => (sut = makeSut()));

  beforeEach(async () => {
    dbClient = new DBSequelizeConnection();
    await dbClient.initialize([ProductModel]);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await dbClient.close();
  });

  it("should update a product", async () => {
    sut.repository.create(
      new Product(productMock.id, productMock.name, productMock.price)
    );

    const output = await sut.useCase.execute(input);
    expect(output).toEqual(input);
  });

  it("should throw an error when try update with invalid name", async () => {
    sut.repository.create(
      new Product(productMock.id, productMock.name, productMock.price)
    );

    await expect(sut.useCase.execute({ ...input, name: "" })).rejects.toThrow(
      "Name is required"
    );
  });

  it("should throw an error when try update with invalid price", async () => {
    sut.repository.create(
      new Product(productMock.id, productMock.name, productMock.price)
    );

    await expect(sut.useCase.execute({ ...input, price: -1 })).rejects.toThrow(
      "Price must be greater than zero"
    );
  });

  it("should throw an error when try update an inexistent product", async () => {
    await expect(
      sut.useCase.execute({ id: "inexistent-product-id" })
    ).rejects.toThrow("Product not found");
  });
});
