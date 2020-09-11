export interface City {
  id: string;
  name: string;
}

export interface Fleet {
  // user defined
  id: string;
  name: string;
  city: City;
  description: string;
  createdBy: string; // id of user who created the fleet
  minimumFee: number; // (in cents) minimum fee charged by couriers
  distanceThreshold: number; // (in meters) distanced covered by the minimumFee
  additionalPerKmAfterThreshold: number; // (in cents) fee charged every km after distanceThreshold
  maxDistance: number; // (in meters) maximum trip distance
  maxDistanceToOrigin: number; // (in meters) maximum distance to the pickup place
  valueThreshold: number; // (in cents) limit without charges over the order value
  feePctOverValue: number; // (percent as decimal; ex: for 2%, set 0.02) fee charged for orders greater than valueThreshold
  // managed by the platform
  situation: string;
  platformFee: string;
  totalParticipants: number;
  participantsOnline: number;
}

export interface FleetState {
  availableCities?: City[];
  allCities?: City[];
  approvedFleets?: Fleet[];
}
