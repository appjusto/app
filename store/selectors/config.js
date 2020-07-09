import { APP_FLAVOR_ADMIN, APP_FLAVOR_CONSUMER, APP_FLAVOR_COURIER } from '../constants';

export const getEnv = (state) => state.config.env;
export const getExtra = (state) => state.config.extra;
export const getFlavor = (state) => state.config.flavor;
export const isAdminFlavor = (state) => getFlavor(state) === APP_FLAVOR_ADMIN;
export const isConsumerFlavor = (state) => getFlavor(state) === APP_FLAVOR_CONSUMER;
export const isCourierFlavor = (state) => getFlavor(state) === APP_FLAVOR_COURIER;