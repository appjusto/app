import {
  Address,
  CourierMode,
  GoogleMapsGeocodePayload,
  GoogleMapsPlacesAutocompletePayload,
  GoogleMapsReverseGeocodePayload,
  LatLng,
  RouteDetails,
} from '@appjusto/types';
import { GoogleMapsDirectionsPayload } from '@appjusto/types/location/payloads';
import axios, { CancelToken } from 'axios';
import * as Sentry from 'sentry-expo';
import { getExtra } from '../../../utils/config';
import { getAppVersion } from '../../../utils/version';
import FirebaseRefs from '../FirebaseRefs';

const { flavor } = getExtra();

export default class MapsApi {
  constructor(private refs: FirebaseRefs) {}
  async googlePlacesAutocomplete(
    input: string,
    sessionToken: string,
    cancelToken?: CancelToken,
    coords?: LatLng
  ): Promise<Address[] | null> {
    const payload: GoogleMapsPlacesAutocompletePayload = {
      operation: 'autocomplete',
      flavor,
      input,
      sessionToken,
      coords,
      meta: { version: getAppVersion() },
    };
    try {
      return (await this.refs.getQueryGoogleMapsCallable()(payload)).data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log('Request canceled!');
      }
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }

  async googleGeocode(address: string): Promise<LatLng | null> {
    const payload: GoogleMapsGeocodePayload = {
      operation: 'geocode',
      flavor,
      address,
      meta: { version: getAppVersion() },
    };
    try {
      console.log('googleGeocode');
      return (await this.refs.getQueryGoogleMapsCallable()(payload)).data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log('Request canceled!');
      }
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }

  async googleReverseGeocode(coords: LatLng): Promise<Address | null> {
    const payload: GoogleMapsReverseGeocodePayload = {
      operation: 'reverse-geocode',
      flavor,
      coords,
      meta: { version: getAppVersion() },
    };
    try {
      console.log('googleReverseGeocode');
      return (await this.refs.getQueryGoogleMapsCallable()(payload)).data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log('Request canceled!');
      }
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }

  async googleDirections(
    origin: string | LatLng,
    destination: string | LatLng,
    mode: CourierMode = 'motorcycle'
  ): Promise<RouteDetails | null> {
    const payload: GoogleMapsDirectionsPayload = {
      operation: 'directions',
      flavor,
      origin,
      destination,
      mode,
      meta: { version: getAppVersion() },
    };
    try {
      console.log('googleDirections');
      return (await this.refs.getQueryGoogleMapsCallable()(payload)).data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log('Request canceled!');
      }
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }
}
