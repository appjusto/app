import { COURIER_STATUS_AVAILABLE, COURIER_STATUS_DISPATCHING } from "../constants";

const courierWorkingStatuses = [COURIER_STATUS_AVAILABLE, COURIER_STATUS_DISPATCHING]

export const isCourierWorking = (state) => courierWorkingStatuses.indexOf(state.courier.status) !== -1;
export const getCourierProfile = (state) => state.courier.profile;
export const getCourierLocation = (state) => state.courier.location;
export const getAvailableCouriers = (state) => state.courier.availableCouriers;