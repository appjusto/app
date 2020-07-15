import { COURIER_STATUS_AVAILABLE, COURIER_STATUS_DISPATCHING } from "../constants";

const courierWorkingStatuses = [COURIER_STATUS_AVAILABLE, COURIER_STATUS_DISPATCHING]

export const getCourierProfile = (state) => state.courier.profile;
export const isCourierWorking = (state) => {
  const profile = getCourierProfile(state);
  if (!profile) return false;
  return courierWorkingStatuses.indexOf(profile.status) !== -1;
}
export const getCourierLocation = (state) => {
  const profile = getCourierProfile(state);
  if (!profile) return null;
  return profile.lastKnownLocation;
}
export const getAvailableCouriers = (state) => state.courier.availableCouriers;