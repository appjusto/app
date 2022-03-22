import { FunctionsRef } from '@appjusto/firebase-refs';
import { Address, CourierMode, LatLng, RouteDetails } from '@appjusto/types';
import * as Sentry from 'sentry-expo';
import { getExtra } from '../../../utils/config';
import { getAppVersion } from '../../../utils/version';

const { flavor } = getExtra();

export default class MapsApi {
  constructor(private functionsRefs: FunctionsRef) {}
  async googlePlacesAutocomplete(input: string, sessionToken: string, coords?: LatLng) {
    console.log('MapsApi.googlePlacesAutocomplete: ', input, coords);

    try {
      return (
        await this.functionsRefs.getQueryGoogleMapsCallable()({
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
    console.log('MapsApi.googleGeocode: ', address);
    try {
      return (
        await this.functionsRefs.getQueryGoogleMapsCallable()({
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
    console.log('MapsApi.googleReverseGeocode: ', coords);
    try {
      return (
        await this.functionsRefs.getQueryGoogleMapsCallable()({
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
    console.log('MapsApi.googleDirections: ', origin, destination);
    try {
      return (
        await this.functionsRefs.getQueryGoogleMapsCallable()({
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
