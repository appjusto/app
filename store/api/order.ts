import axios from 'axios';

import { Place } from '../types';

export default class OrderApi {
  constructor(private functionsEndpoint: string) {}
  async createOrder(origin: Place, destination: Place) {
    const params = {
      origin,
      destination,
    };
    try {
      const url = `${this.functionsEndpoint}/createOrder`;
      const response = await axios.post(url, params);
      return response.data;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async confirmOrder(orderId: string, cardId: string) {
    const params = {
      orderId,
      cardId,
    };
    try {
      const url = `${this.functionsEndpoint}/confirmOrder`;
      const response = await axios.post(url, params);
      return response.data;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  async matchOrder(orderId: string) {
    const params = {
      orderId,
    };
    try {
      const url = `${this.functionsEndpoint}/matchOrder`;
      const response = await axios.post(url, params);
      return response.data;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
}
