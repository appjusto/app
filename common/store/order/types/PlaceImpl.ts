import { isEmpty } from 'lodash';

import { Place } from '.';

export default class PlaceImpl {
  constructor(protected source: Place) {}

  public get address() {
    return this.source.address;
  }

  public get googlePlaceId() {
    return this.source.googlePlaceId;
  }

  public get additionalInfo() {
    return this.source.additionalInfo;
  }

  public get location() {
    return this.source.location;
  }

  public get intructions() {
    return this.source.intructions;
  }

  public getData(): Place {
    return this.source;
  }

  public merge(newSource: Place): PlaceImpl {
    return new PlaceImpl(Object.assign({}, this.source, newSource));
  }

  public sameAdddress(anotherPlace: PlaceImpl): boolean {
    return this.address === anotherPlace.address;
  }

  public valid(): boolean {
    // TODO: implement validation
    return !isEmpty(this.address) /*&& !isEmpty(this.source.description)*/;
  }

  public toSring() {
    return JSON.stringify(this.source, null, 2);
  }
}
