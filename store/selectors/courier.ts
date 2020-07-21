import { State } from "..";
import { CourierState, Courier, CourierStatus } from "../types/courier";

export const getCourierState = (state: State): CourierState => {
  return state.courier;
}

// profile
export const getCourier = (state:State):Courier => getCourierState(state).courier;
export const getCourierStatus = (state:State):CourierStatus => {
  const courier = getCourier(state);
  if (!courier) return CourierStatus.Unavailable;
  return courier.status;
};
export const isCourierWorking = (state:State) => getCourierStatus(state) !== CourierStatus.Unavailable;
export const getCourierLocation = (state:State) => getCourier(state).location;
export const getAvailableCouriers = (state:State) => getCourierState(state).availableCouriers;