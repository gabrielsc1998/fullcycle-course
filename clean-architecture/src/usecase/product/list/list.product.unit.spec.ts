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

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest
      .fn()
      .mockReturnValue(Promise.resolve([productMock1, productMock2])),
    create: jest.fn(),
    update: jest.fn(),
  };
};

type SUT = {
  repository: ProductRepositoryInterface;
  useCase: ListProductsUseCase;
};

const makeSut = (): SUT => {
  const productRepository = MockRepository();
  const productFindUseCase = new ListProductsUseCase(productRepository);

  return {
    repository: productRepository,
    useCase: productFindUseCase,
  };
};

let sut: SUT = null;

describe("List Products Use Case [ unity ]", () => {
  beforeAll(() => (sut = makeSut()));

  it("should list all products", async () => {
    const output = await sut.useCase.execute({});
    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(productMock1.id);
    expect(output.products[0].name).toBe(productMock1.name);
    expect(output.products[0].price).toBe(productMock1.price);
    expect(output.products[1].id).toBe(productMock2.id);
    expect(output.products[1].name).toBe(productMock2.name);
    expect(output.products[1].price).toBe(productMock2.price);
  });
});
