import EventDispatcher from "../../../../@shared/event/event-dispatcher";

import CustomerCreatedEvent from "../../customer-created.event";

import SendConsoleLog1HandlerWhenCustomerIsCreated from "../send-console-log-1-when-customer-is-created.handler";

const makeEventHandler = (): SendConsoleLog1HandlerWhenCustomerIsCreated => {
  return new SendConsoleLog1HandlerWhenCustomerIsCreated();
};

const makeEventDispatcher = (): EventDispatcher => {
  return new EventDispatcher();
};

describe("Send Console Log 1 Handler When Customer is Created", () => {
  it("should call handler when the event is called [ Customer Created ]", () => {
    const eventHandler = makeEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const eventName = CustomerCreatedEvent.name;

    const eventDispatcher = makeEventDispatcher();
    eventDispatcher.register(eventName, eventHandler);

    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    const customerCreatedEvent = new CustomerCreatedEvent("any-data");

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toBeCalledWith(customerCreatedEvent);
  });

  it("should not call handler when the event is not registered", () => {
    const eventHandler = makeEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const eventName = CustomerCreatedEvent.name;

    const eventDispatcher = makeEventDispatcher();

    const customerCreatedEvent = new CustomerCreatedEvent("any-data");

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).not.toBeCalledWith();
  });

  it("should not call handler when the event is call but not notified", () => {
    const eventHandler = makeEventHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const eventName = CustomerCreatedEvent.name;

    const eventDispatcher = makeEventDispatcher();
    eventDispatcher.register(eventName, eventHandler);

    expect(eventDispatcher.getEventHandlers[eventName][0]).toMatchObject(
      eventHandler
    );

    new CustomerCreatedEvent("any-data");

    expect(spyEventHandler).not.toBeCalledWith();
  });
});
