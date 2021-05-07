import { Flavor } from '@appjusto/types';
import { Extra } from '../../../config/types';

export interface ConfigState {
  flavor: Flavor;
  extra: Extra;
}
