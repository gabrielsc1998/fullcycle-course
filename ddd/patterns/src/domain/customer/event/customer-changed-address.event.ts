import EventInterface from "../../@shared/event/event.interface";

import Address from "../value-object/address";

export type CustomerChangedAddressEventData = {
  id: string;
  name: string;
  address: Address;
};

export default class CustomerChangedAddressEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: CustomerChangedAddressEventData;

  constructor(eventData: CustomerChangedAddressEventData) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
