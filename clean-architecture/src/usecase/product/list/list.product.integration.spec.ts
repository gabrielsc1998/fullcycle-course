import Product from "../../../domain/product/entity/product";
import { DBSequelizeConnection } from "../../../common/test/db/db-sequelize.connection";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

import ListProductsUseCase from "./list.product.usecase";

const productMock1 = {
  id: "product-id-1",
  name: "product-name-1",
  price: 10,
};

const productMock2 = {
  id: "product-id-2",
  name: "product-name-2",
  price: 10,
};

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: ListProductsUseCase;
};

const makeSut = (): SUT => {
  const productRepository = new ProductRepository();
  const productFindUseCase = new ListProductsUseCase(productRepository);

  return {
    repository: productRepository,
    useCase: productFindUseCase,
  };
};

let sut: SUT = null;

describe("List Products Use Case [ integration ]", () => {
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

  it("should list all products", async () => {
    sut.repository.create(
      new Product(productMock1.id, productMock1.name, productMock1.price)
    );
    sut.repository.create(
      new Product(productMock2.id, productMock2.name, productMock2.price)
    );

    const spyRepoFindall = jest.spyOn(sut.repository, "findAll");

    const output = await sut.useCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(productMock1.id);
    expect(output.products[0].name).toBe(productMock1.name);
    expect(output.products[0].price).toBe(productMock1.price);
    expect(output.products[1].id).toBe(productMock2.id);
    expect(output.products[1].name).toBe(productMock2.name);
    expect(output.products[1].price).toBe(productMock2.price);

    expect(spyRepoFindall).toBeCalled();
  });

  it("should receive an empty array when the database is empty", async () => {
    const spyRepoFindall = jest.spyOn(sut.repository, "findAll");

    const output = await sut.useCase.execute({});

    expect(output.products.length).toBe(0);
    expect(spyRepoFindall).toBeCalled();
  });
});
