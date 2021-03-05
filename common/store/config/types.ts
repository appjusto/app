import { Flavor } from 'appjusto-types/platform';
import { Extra } from '../../utils/config';

export interface ConfigState {
  flavor: Flavor;
  extra: Extra;
  env: 'development' | 'production';
}
