import { Flavor } from 'appjusto-types/platform';
import { Extra } from '../../../config/types';

export interface ConfigState {
  flavor: Flavor;
  extra: Extra;
}
