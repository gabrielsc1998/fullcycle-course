import CustomerCreatedEvent from "../customer-created.event";

const makeCustomerCreatedEvent = (data: any): CustomerCreatedEvent => {
  return new CustomerCreatedEvent(data);
};

describe("Customer Created Event", () => {
  it("should create an event", () => {
    const customerCreatedEvent = makeCustomerCreatedEvent("any-data");
    expect(customerCreatedEvent).toBeDefined();
    expect(customerCreatedEvent.eventData).toEqual("any-data");
    expect(customerCreatedEvent.dataTimeOccurred).toBeDefined();
  });
});
