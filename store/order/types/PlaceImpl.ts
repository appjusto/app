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

  public valid(): boolean {
    // TODO: implement validation
    return !isEmpty(this.source.address) /*&& !isEmpty(this.source.description)*/;
  }

  public toSring() {
    return JSON.stringify(this.source, null, 2);
  }
}
