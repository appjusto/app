// eslint-disable-next-line import/order
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/functions';
import { Platform } from 'react-native';
import { Extra } from '../../utils/config';
import AuthApi from './auth';
import BusinessApi from './business';
import ConsumerApi from './business/consumer';
import CourierApi from './courier';
import FilesApi from './files';
import FirebaseRefs from './FirebaseRefs';
import FleetApi from './fleet';
import MapsApi from './maps';
import OrderApi from './order';
import IuguApi from './payment/iugu';
import ProfileApi from './profile';
import SearchApi from './search/SearchApi';

export default class Api {
  private authentication: firebase.auth.Auth;
  private firestore: firebase.firestore.Firestore;
  private functions: firebase.functions.Functions;
  private storage: firebase.storage.Storage;

  private _refs: FirebaseRefs;
  private _auth: AuthApi;
  private _profile: ProfileApi;
  private _courier: CourierApi;
  private _fleet: FleetApi;
  private _consumer: ConsumerApi;
  private _order: OrderApi;
  private _maps: MapsApi;
  private _files: FilesApi;
  private _iugu: IuguApi;
  private _business: BusinessApi;
  private _search: SearchApi;

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

    this._refs = new FirebaseRefs(this.functions, this.firestore);
    this._iugu = new IuguApi(extra.iugu.accountId);
    this._files = new FilesApi(this.storage);
    this._auth = new AuthApi(this._refs, this.authentication, extra);
    this._profile = new ProfileApi(this.firestore, collectionName);
    this._courier = new CourierApi(this._refs, this._files);
    this._fleet = new FleetApi(this._refs);
    this._consumer = new ConsumerApi(this._refs, this._iugu);
    this._order = new OrderApi(this._refs);
    this._maps = new MapsApi(apiKey!);
    this._business = new BusinessApi(this._refs);
    this._search = new SearchApi(extra.algolia);
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

  business() {
    return this._business;
  }

  search() {
    return this._search;
  }
}
