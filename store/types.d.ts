export interface Courier {
  id: string;
}

export interface LatLng {
  latitude: string;
  longitude: string;
}

export interface Place {
  address: string;
  additionalInfo?: string;
  description?: string;
  location?: LatLng;
}