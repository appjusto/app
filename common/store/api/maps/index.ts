import { Address, LatLng } from '@appjusto/types';
import axios, { CancelToken } from 'axios';
import * as Sentry from 'sentry-expo';

const SEARCH_RADIUS = 30 * 1000; // 30km

export default class MapsApi {
  constructor(private googleMapsApiKey: string) {}
  async googlePlacesAutocomplete(
    input: string,
    sessionToken: string,
    cancelToken?: CancelToken,
    coords?: LatLng
  ): Promise<Address[] | null> {
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const params = Object.assign(
      {
        key: this.googleMapsApiKey,
        input,
        sessionToken,
        // types: 'address',
        components: 'country:BR', // i18n
        language: 'pt-BR', // i18n
      },
      coords
        ? { locationbias: `circle:${SEARCH_RADIUS}@${coords?.latitude},${coords?.longitude}` }
        : {}
    );
    try {
      const response = await axios.get(url, { cancelToken, params });
      const { data } = response;
      const predictions = data.predictions as google.maps.places.AutocompletePrediction[];
      return predictions.map((prediction) => {
        const { description, place_id: googlePlaceId, structured_formatting } = prediction;
        const { main_text: main, secondary_text: secondary } = structured_formatting;
        return {
          main,
          secondary,
          description,
          googlePlaceId,
        };
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled!');
        return null;
      }
      console.log(error);
      Sentry.Native.captureException(error);
      return error;
    }
  }

  async googleGeocode(address: string): Promise<LatLng | null> {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      key: this.googleMapsApiKey,
      address,
      language: 'pt-BR', // i18n
    };
    try {
      const response = await axios.get(url, { params });
      const { data } = response;
      const { results } = data;
      const [result] = results;
      const { geometry } = result;
      const { location } = geometry;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      console.log(error);
      Sentry.Native.captureException(error);
      return null;
    }
  }
  async googleReverseGeocode(coords: LatLng): Promise<Address | null> {
    const lat = coords.latitude;
    const long = coords.longitude;
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      key: this.googleMapsApiKey,
      latlng: `${lat},${long}`,
      language: 'pt-BR', // i18n
    };
    const response = await axios.get(url, { params });
    const { data } = response;
    const { results } = data;
    const [result] = results as google.maps.GeocoderResult[];
    const { address_components } = result;
    const getAddress = (type: string) => address_components.find((c) => c.types.includes(type));
    const country = getAddress('country');
    const state = getAddress('administrative_area_level_1');
    const city = getAddress('administrative_area_level_2');
    const neighborhood = getAddress('sublocality');
    const street = getAddress('route');
    const streetNumber = getAddress('street_number');
    const main = `${street?.short_name}, ${streetNumber?.short_name}`;
    const secondary = `${neighborhood?.short_name}, ${city?.short_name} - ${state?.short_name}, ${country?.long_name}`;
    const description = `${main} - ${secondary}`;
    return {
      main,
      secondary,
      description,
      googlePlaceId: result.place_id,
    };
  }
}
