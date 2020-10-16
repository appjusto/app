// eslint-disable-next-line import/order
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/functions';

import { Platform } from 'react-native';

import { Extra } from '../../utils/config';
import AuthApi from './auth';
import ConsumerApi from './consumer';
import CourierApi from './courier';
import FilesApi from './files';
import FleetApi from './fleet';
import MapsApi from './maps';
import OrderApi from './order';
import IuguApi from './payment/iugu';
import ProfileApi from './profile';

export default class Api {
  private authentication: firebase.auth.Auth;
  private firestore: firebase.firestore.Firestore;
  private functions: firebase.functions.Functions;
  private storage: firebase.storage.Storage;

  private _auth: AuthApi;
  private _profile: ProfileApi;
  private _courier: CourierApi;
  private _fleet: FleetApi;
  private _consumer: ConsumerApi;
  private _order: OrderApi;
  private _maps: MapsApi;
  private _files: FilesApi;
  private _iugu: IuguApi;

  constructor(extra: Extra) {
    const apiKey = Platform.select(extra.googleApiKeys);
    firebase.initializeApp({ ...extra.firebase, apiKey });

    this.authentication = firebase.auth();
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

    this._iugu = new IuguApi(extra.iugu.accountId);
    this._files = new FilesApi(this.storage);
    this._auth = new AuthApi(this.authentication, this.functions, extra);
    this._profile = new ProfileApi(this.firestore, this.functions, collectionName);
    this._courier = new CourierApi(this.firestore, this.functions, this._files);
    this._fleet = new FleetApi(this.firestore, this.functions);
    this._consumer = new ConsumerApi(this.firestore, this.functions, this._iugu);
    this._order = new OrderApi(this.firestore, this.functions);
    this._maps = new MapsApi(apiKey!);
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

  fleet() {
    return this._fleet;
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
