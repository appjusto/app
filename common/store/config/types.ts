export type Flavor = 'consumer' | 'courier';

export interface ConfigState {
  flavor: Flavor;
  extra: object;
  env: 'development' | 'production';
}
