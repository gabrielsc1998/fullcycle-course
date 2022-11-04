import Product from "../../../domain/product/entity/product";
import { DBSequelizeConnection } from "../../../common/test/db/db-sequelize.connection";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

import FindProductUseCase from "./find.product.usecase";

const productMock = {
  id: "product-id",
  name: "product-name",
  price: 10,
};

const input = {
  id: productMock.id,
};

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: FindProductUseCase;
};

const makeSut = (): SUT => {
  const productRepository = new ProductRepository();
  const productFindUseCase = new FindProductUseCase(productRepository);

  return {
    repository: productRepository,
    useCase: productFindUseCase,
  };
};

let sut: SUT = null;

describe("Find Product Use Case [ unity ]", () => {
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

  it("should get the product", async () => {
    await sut.repository.create(
      new Product(productMock.id, productMock.name, productMock.price)
    );

    const output = await sut.useCase.execute(input);

    expect(output).toEqual(productMock);
  });

  it("should throw an error when product not exists", async () => {
    const spyRepository = jest.spyOn(sut.repository, "find");

    await expect(
      sut.useCase.execute({ id: "inexistent-product-id" })
    ).rejects.toThrow("Product not found");

    expect(spyRepository).toBeCalledWith("inexistent-product-id");
  });

  it("should throw an error when product not exists [ id null ]", async () => {
    const spyRepository = jest.spyOn(sut.repository, "find");

    await expect(sut.useCase.execute({ id: null })).rejects.toThrow(
      "Product not found"
    );

    expect(spyRepository).toBeCalledWith(null);
  });

  it("should throw an error when product not exists [ input null ]", async () => {
    await expect(sut.useCase.execute(null)).rejects.toThrow(
      "Product not found"
    );
  });
});
