import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

import CreateProductUseCase from "./create.product.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: CreateProductUseCase;
};

const makeSut = (): SUT => {
  const productRepository = MockRepository();
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

describe("Create Product Use Case [ unity ]", () => {
  beforeAll(() => (sut = makeSut()));

  it("should create a product", async () => {
    const output = await sut.useCase.execute(input);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should thrown an error when name is missing", async () => {
    await expect(sut.useCase.execute({ ...input, name: "" })).rejects.toThrow(
      "Name is required"
    );
  });

  it("should thrown an error when the price is less than zero", async () => {
    await expect(sut.useCase.execute({ ...input, price: -1 })).rejects.toThrow(
      "Price must be greater than zero"
    );
  });

  it("should throw an error when all data is invalid", async () => {
    await expect(sut.useCase.execute({ name: "", price: -1 })).rejects.toThrow(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
