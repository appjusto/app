import { isEmpty, trim } from 'lodash';

import { CourierStatus, CourierInfo } from './types';

export interface CourierObject {
  id: string;
  info?: CourierInfo;
  name?: string;
  status?: CourierStatus;
  notificationToken?: string;
}

export default class Courier {
  constructor(private source: CourierObject) {}

  public get id() {
    return this.source.id;
  }

  public get status() {
    return this.source.status;
  }

  public get notificationToken() {
    return this.source.notificationToken;
  }

  public getSource(): CourierObject {
    return this.source;
  }

  public personalInfoSet(): boolean {
    return !isEmpty(trim(this.source.name));
  }
}
