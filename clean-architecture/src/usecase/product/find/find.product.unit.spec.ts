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

const MockRepository = () => {
  return {
    find: jest.fn().mockResolvedValue(productMock),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: FindProductUseCase;
};

const makeSut = (): SUT => {
  const productRepository = MockRepository();
  const productFindUseCase = new FindProductUseCase(productRepository);

  return {
    repository: productRepository,
    useCase: productFindUseCase,
  };
};

let sut: SUT = null;

describe("Find Product Use Case [ unity ]", () => {
  beforeAll(() => (sut = makeSut()));

  it("should get the product", async () => {
    const output = await sut.useCase.execute(input);
    expect(output).toEqual(productMock);
  });

  it("should throw an error when product not exists", async () => {
    jest.spyOn(sut.repository, "find").mockImplementation(() => {
      throw new Error("Product not found");
    });

    await expect(
      sut.useCase.execute({ id: "inexistent-product-id" })
    ).rejects.toThrow("Product not found");
  });

  it("should throw an error when product not exists [ id null ]", async () => {
    jest.spyOn(sut.repository, "find").mockImplementation(() => {
      throw new Error("Product not found");
    });

    await expect(sut.useCase.execute({ id: null })).rejects.toThrow(
      "Product not found"
    );
  });

  it("should throw an error when product not exists [ input null ]", async () => {
    jest.spyOn(sut.repository, "find").mockImplementation(() => {
      throw new Error("Product not found");
    });

    await expect(sut.useCase.execute(null)).rejects.toThrow(
      "Product not found"
    );
  });
});
