import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/functions';

import { Platform } from 'react-native';

import { Extra } from '../../utils/config';
import AuthApi from './auth';
import ConsumerApi from './consumer';
import CourierApi from './courier';
import MapsApi from './maps';
import OrderApi from './order';
import ProfileApi from './profile';
import FilesApi from './files';

export default class Api {
  private firestore: firebase.firestore.Firestore;
  private functions: firebase.functions.Functions;
  private storage: firebase.storage.Storage;

  private _auth: AuthApi;
  private _profile: ProfileApi;
  private _courier: CourierApi;
  private _consumer: ConsumerApi;
  private _order: OrderApi;
  private _maps: MapsApi;
  private _files: FilesApi;

  constructor(extra: Extra) {
    const apiKey = Platform.select(extra.googleApiKeys);
    firebase.initializeApp({ ...extra.firebase, apiKey });

    this.firestore = firebase.firestore();
    this.functions = firebase.functions();
    this.storage = firebase.storage();

    if (extra.firebase.emulator.enabled) {
      this.firestore.settings({
        host: extra.firebase.emulator.databaseURL,
        ssl: false,
      });
      this.functions.useFunctionsEmulator(extra.firebase.emulator.functionsURL);
    }

    const collectionName = extra.flavor === 'consumer' ? 'consumers' : 'couriers';

    this._auth = new AuthApi(extra);
    this._profile = new ProfileApi(this.firestore, this.functions, collectionName);
    this._courier = new CourierApi(this.firestore, this.functions);
    this._consumer = new ConsumerApi(this.firestore, this.functions);
    this._order = new OrderApi(this.firestore, this.functions);
    this._maps = new MapsApi(apiKey!);
    this._files = new FilesApi(this.storage);
  }

  auth() {
    return this._auth;
  }

  profile() {
    return this._profile;
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

  files() {
    return this._files;
  }
}
