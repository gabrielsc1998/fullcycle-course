import Address from "../../value-object/address";

import CustomerChangedAddressEvent, {
  CustomerChangedAddressEventData,
} from "../customer-changed-address.event";

const mockCustomerChangedAddressData: CustomerChangedAddressEventData = {
  id: "customer-id",
  name: "customer-name",
  address: new Address("street", 1, "zip", "city"),
};

const makeCustomerChangedAddressEvent = (): CustomerChangedAddressEvent => {
  return new CustomerChangedAddressEvent(mockCustomerChangedAddressData);
};

describe("Customer Changed Address Event", () => {
  it("should create an event", () => {
    const customerChangedAddressEvent = makeCustomerChangedAddressEvent();
    expect(customerChangedAddressEvent).toBeDefined();
    expect(customerChangedAddressEvent.eventData).toEqual(
      mockCustomerChangedAddressData
    );
    expect(customerChangedAddressEvent.dataTimeOccurred).toBeDefined();
  });
});
