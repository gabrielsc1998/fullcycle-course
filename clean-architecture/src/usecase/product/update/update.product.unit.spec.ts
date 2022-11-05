import Product from "../../../domain/product/entity/product";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";

import UpdateProductUseCase from "./update.product.usecase";

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

const MockRepository = () => {
  return {
    find: jest
      .fn()
      .mockResolvedValue(
        new Product(productMock.id, productMock.name, productMock.price)
      ),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: UpdateProductUseCase;
};

const makeSut = (): SUT => {
  const productRepository = MockRepository();
  const productUpdateUseCase = new UpdateProductUseCase(productRepository);

  return {
    repository: productRepository,
    useCase: productUpdateUseCase,
  };
};

let sut: SUT = null;

describe("Update Product Use Case [ unity ]", () => {
  beforeAll(() => (sut = makeSut()));

  it("should update a product", async () => {
    const output = await sut.useCase.execute(input);
    expect(output).toEqual(input);
  });

  it("should throw an error when try update with invalid name", async () => {
    await expect(sut.useCase.execute({ ...input, name: "" })).rejects.toThrow(
      "product: Name is required"
    );
  });

  it("should throw an error when try update with invalid price", async () => {
    await expect(sut.useCase.execute({ ...input, price: -1 })).rejects.toThrow(
      "product: Price must be greater than zero"
    );
  });

  it("should throw an error when try update an inexistent product", async () => {
    jest.spyOn(sut.repository, "find").mockImplementation(() => {
      throw new Error("Product not found");
    });

    await expect(
      sut.useCase.execute({ id: "inexistent-product-id" })
    ).rejects.toThrow("Product not found");
  });
});
