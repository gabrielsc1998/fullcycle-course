import CustomerChangedAddressEvent from "../customer-changed-address.event";

const makeCustomerChangedAddressEvent = (
  data: any
): CustomerChangedAddressEvent => {
  return new CustomerChangedAddressEvent(data);
};

describe("Customer Changed Address Event", () => {
  it("should create an event", () => {
    const customerChangedAddressEvent =
      makeCustomerChangedAddressEvent("any-data");
    expect(customerChangedAddressEvent).toBeDefined();
    expect(customerChangedAddressEvent.eventData).toEqual("any-data");
    expect(customerChangedAddressEvent.dataTimeOccurred).toBeDefined();
  });
});
