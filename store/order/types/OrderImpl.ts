import { Order } from '.';

export default class OrderImpl {
  constructor(protected source: Order) {}

  public getData(): Order {
    return this.source;
  }

  public valid(): boolean {
    // TODO: implement validation
    return !!this.source;
  }
}
