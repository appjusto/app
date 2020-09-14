import { UserProfile } from 'appjusto-types';

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

  public merge(newSource: UserProfile): User {
    return new User(Object.assign({}, this.source, newSource));
  }

  public personalInfoSet(): boolean {
    return true;
  }
}
