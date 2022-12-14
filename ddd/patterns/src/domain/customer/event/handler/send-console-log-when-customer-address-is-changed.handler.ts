import EventHandlerInterface from "../../../@shared/event/event-handler.interface";

import Address from "../../value-object/address";

import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class SendConsoleLogWhenCustomerAddressIsChanged
  implements EventHandlerInterface<CustomerChangedAddressEvent>
{
  handle(event: CustomerChangedAddressEvent): void {
    const { id, name, address } = event.eventData;

    console.log(
      `Endereço do cliente: ${id}, ${name} alterado para: ${address.toString()}`
    );
  }
}
