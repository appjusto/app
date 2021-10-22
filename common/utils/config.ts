import Constants from 'expo-constants';
import { Extra } from '../../config/types';

export const getExtra = (): Extra => Constants.manifest!.extra as Extra;
