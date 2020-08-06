import { isEmpty } from 'lodash';

import { UserProfile } from '.';

export default class User {
  constructor(protected source: UserProfile) {}

  public get id() {
    return this.source.id;
  }

  public get name() {
    return this.source.name;
  }

  public get surname() {
    return this.source.surname;
  }

  public get cpf() {
    return this.source.cpf;
  }

  public get phone() {
    return this.source.phone;
  }

  public get notificationToken() {
    return this.source.notificationToken;
  }

  public getSource(): UserProfile {
    return this.source;
  }

  public personalInfoSet(): boolean {
    return !isEmpty(this.name) && !isEmpty(this.surname) && !isEmpty(this.cpf);
  }
}
