import { isEmpty } from 'lodash';

import { Place } from '.';

export default class PlaceImpl {
  constructor(protected source: Place) {}

  public getData(): Place {
    return this.source;
  }

  public merge(newSource: Place): PlaceImpl {
    return new PlaceImpl(Object.assign({}, this.source, newSource));
  }

  public sameAdddress(anotherPlace: PlaceImpl): boolean {
    const { addressTexts } = this.getData();
    const { addressTexts: anotherPlaceaddressTexts } = anotherPlace.getData();
    return addressTexts?.every((t, i) => t === anotherPlaceaddressTexts?.[i]) === true;
  }

  public valid(): boolean {
    // TODO: implement validation
    return !isEmpty(this.source.addressTexts) /*&& !isEmpty(this.source.description)*/;
  }

  public toSring() {
    return JSON.stringify(this.source, null, 2);
  }
}
