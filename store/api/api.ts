import firebase from 'firebase';
import 'firebase/firestore';

import { Extra } from '../../utils/config';
import AuthApi from './auth';
import ConsumerApi from './consumer';
import CourierApi from './courier';
import MapsApi from './maps';
import OrderApi from './order';

export default class Api {
  private firestore: firebase.firestore.Firestore;

  private _auth: AuthApi;
  private _courier: CourierApi;
  private _consumer: ConsumerApi;
  private _order: OrderApi;
  private _maps: MapsApi;

  constructor(extra: Extra) {
    firebase.initializeApp(extra.firebase);

    this.firestore = firebase.firestore();

    if (extra.firebase.emulator.enabled) {
      this.firestore.settings({
        host: extra.firebase.emulator.databaseURL,
        ssl: false,
      });
    }
    const functionsEndpoint = !extra.firebase.emulator.enabled
      ? extra.firebase.functionsURL
      : extra.firebase.emulator.functionsURL;

    this._auth = new AuthApi(extra);
    this._courier = new CourierApi(this.firestore);
    this._consumer = new ConsumerApi(this.firestore);
    this._order = new OrderApi(functionsEndpoint);
    this._maps = new MapsApi(extra.googleMapsApiKey);
  }

  auth() {
    return this._auth;
  }

  courier() {
    return this._courier;
  }

  consumer() {
    return this._consumer;
  }

  order() {
    return this._order;
  }

  maps() {
    return this._maps;
  }
}
