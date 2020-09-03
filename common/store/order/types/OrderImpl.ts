import { Order } from '.';
import PlaceImpl from './PlaceImpl';

export default class OrderImpl {
  constructor(protected source: Order) {}

  public getData(): Order {
    return this.source;
  }

  public getOrigin(): PlaceImpl {
    return new PlaceImpl(this.getData().origin);
  }

  public getDestination(): PlaceImpl {
    return new PlaceImpl(this.getData().destination);
  }

  public valid(): boolean {
    // TODO: implement validation
    return !!this.source;
  }
}
