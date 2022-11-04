import EventDispatcher from "../../../../@shared/event/event-dispatcher";

import Address from "../../../value-object/address";

import CustomerChangedAddressEvent, {
  CustomerChangedAddressEventData,
} from "../../customer-changed-address.event";

import SendConsoleLogWhenCustomerAddressIsChanged from "../send-console-log-when-customer-address-is-changed.handler";

const makeEventHandler = (): SendConsoleLogWhenCustomerAddressIsChanged => {
  return new SendConsoleLogWhenCustomerAddressIsChanged();
};

const makeEventDispatcher = (): EventDispatcher => {
  return new EventDispatcher();
};

const mockCustomerChangedAddressData: CustomerChangedAddressEventData = {
  id: "customer-id",
  name: "customer-name",
  address: new Address("street", 1, "zip", "city"),
};

describe("Send Console Log 1 Handler When Customer is Created", () => {
  it("should call handler when the event is called [ Customer Created ]", () => {
    const eventHandler = makeEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const eventName = CustomerChangedAddressEvent.name;

    const eventDispatcher = makeEventDispatcher();
    eventDispatcher.register(eventName, eventHandler);

    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    const customerChangedAddressEvent = new CustomerChangedAddressEvent(
      mockCustomerChangedAddressData
    );

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toBeCalledWith(customerChangedAddressEvent);
  });

  it("should not call handler when the event is not registered", () => {
    const eventHandler = makeEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const eventName = CustomerChangedAddressEvent.name;

    const eventDispatcher = makeEventDispatcher();

    const customerChangedAddressEvent = new CustomerChangedAddressEvent(null);

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).not.toBeCalledWith();
  });

  it("should not call handler when the event is call but not notified", () => {
    const eventHandler = makeEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const eventName = CustomerChangedAddressEvent.name;

    const eventDispatcher = makeEventDispatcher();
    eventDispatcher.register(eventName, eventHandler);

    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    new CustomerChangedAddressEvent(null);

    expect(spyEventHandler).not.toBeCalledWith();
  });
});
