import { isCourierWorking } from './courier';
import { isCourierFlavor } from "./config"

export const isBroadcastingLocation = (state) => {
  if (isCourierFlavor(state) && isCourierWorking(state)) return true;
  return false;
}