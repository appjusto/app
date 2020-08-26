import axios, { CancelToken } from 'axios';

type GooglePlacesAddressResult = {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  terms: { value: string }[];
};

type GooglePlacesPredictionsResult = {
  predictions: GooglePlacesAddressResult[];
};

export type AutoCompleteResult = {
  description: string;
  placeId?: string;
  main: string;
  secondary: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
};

export default class MapsApi {
  constructor(private googleMapsApiKey: string) {}
  async googlePlacesAutocomplete(
    input: string,
    sessiontoken: string,
    cancelToken: CancelToken
  ): Promise<AutoCompleteResult[] | null> {
    // TODO: location & radius?
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const params = {
      key: this.googleMapsApiKey,
      input,
      sessiontoken,
      types: 'address',
      components: 'country:BR', // i18n
      language: 'pt-BR', // i18n
    };
    try {
      const response = await axios.get(url, { cancelToken, params });
      const { predictions } = response.data as GooglePlacesPredictionsResult;
      return predictions.map((prediction) => {
        const { description, place_id: placeId, terms, structured_formatting } = prediction;
        const { main_text: main, secondary_text: secondary } = structured_formatting;
        const [neighborhood, city, state, country] = terms.map((term) => term.value);
        return {
          description,
          placeId,
          main,
          secondary,
          neighborhood,
          city,
          state,
          country,
        };
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled!');
        return null;
      }
      console.error(err);
      return err;
    }
  }

  async googleGeocode(address: string) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      key: this.googleMapsApiKey,
      address,
      region: 'br', // i18n
      components: 'country:BR', // i18n
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
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
