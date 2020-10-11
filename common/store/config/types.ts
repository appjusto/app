import { Flavor } from 'appjusto-types/platform';

export interface ConfigState {
  flavor: Flavor;
  extra: object;
  env: 'development' | 'production';
}
