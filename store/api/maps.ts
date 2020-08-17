import axios from 'axios';

type GoogleAddressResult = {
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

export default class MapsApi {
  constructor(private googleMapsApiKey: string) {}
  async googlePlacesAutocomplete(
    input: string,
    sessiontoken: string
  ): Promise<GoogleAddressResult[]> {
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
      const response = await axios.get(url, { params });
      return response.data;
    } catch (err) {
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
