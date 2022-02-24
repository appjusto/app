import { Address, CourierMode, LatLng, RouteDetails } from '@appjusto/types';
import * as Sentry from 'sentry-expo';
import { getExtra } from '../../../utils/config';
import { getAppVersion } from '../../../utils/version';
import FirebaseRefs from '../FirebaseRefs';

const { flavor } = getExtra();

export default class MapsApi {
  constructor(private refs: FirebaseRefs) {}
  async googlePlacesAutocomplete(input: string, sessionToken: string, coords?: LatLng) {
    try {
      return (
        await this.refs.getQueryGoogleMapsCallable()({
          operation: 'autocomplete',
          flavor,
          input,
          sessionToken,
          coords,
          meta: { version: getAppVersion() },
        })
      ).data as Address[];
    } catch (error: any) {
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }

  async googleGeocode(address: string) {
    try {
      return (
        await this.refs.getQueryGoogleMapsCallable()({
          operation: 'geocode',
          flavor,
          address,
          meta: { version: getAppVersion() },
        })
      ).data as LatLng;
    } catch (error: any) {
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }

  async googleReverseGeocode(coords: LatLng) {
    try {
      return (
        await this.refs.getQueryGoogleMapsCallable()({
          operation: 'reverse-geocode',
          flavor,
          coords,
          meta: { version: getAppVersion() },
        })
      ).data as Address;
    } catch (error: any) {
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }

  async googleDirections(
    origin: string | LatLng,
    destination: string | LatLng,
    mode: CourierMode = 'motorcycle'
  ) {
    try {
      return (
        await this.refs.getQueryGoogleMapsCallable()({
          operation: 'directions',
          flavor,
          origin,
          destination,
          mode,
          meta: { version: getAppVersion() },
        })
      ).data as RouteDetails;
    } catch (error: any) {
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }
}
