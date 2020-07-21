import { COURIER_STATUS_AVAILABLE, COURIER_STATUS_DISPATCHING } from "../constants";

const courierWorkingStatuses = [COURIER_STATUS_AVAILABLE, COURIER_STATUS_DISPATCHING]

export const getCourierProfile = (state) => state.courier.profile;
export const getCourierStatus = (state) => {
  const profile = getCourierProfile(state);
  if (!profile) return null;
  return profile.status;
}
export const isCourierWorking = (state) => {
  const status = getCourierStatus(state);
  if (!status) return false;
  return courierWorkingStatuses.indexOf(status) !== -1;
}
export const getCourierLocation = (state) => {
  const profile = getCourierProfile(state);
  if (!profile) return null;
  return profile.lastKnownLocation;
}
export const getAvailableCouriers = (state) => state.courier.availableCouriers;