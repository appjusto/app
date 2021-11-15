// eslint-disable-next-line import/order
import { CourierProfile, DeleteAccountPayload } from '@appjusto/types';
import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/functions';
import { Platform } from 'react-native';
import { Extra } from '../../../config/types';
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
import PlatformApi from './platform';
import ProfileApi from './profile';
import SearchApi from './search/SearchApi';
import UserApi from './users';

export default class Api {
  private authentication: firebase.auth.Auth;
  private firestore: firebase.firestore.Firestore;
  private functions: firebase.functions.Functions;
  private storage: firebase.storage.Storage;

  private _refs: FirebaseRefs;
  private _auth: AuthApi;
  private _platform: PlatformApi;
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
  private _user: UserApi;

  constructor(extra: Extra) {
    const emulated = extra.firebase.emulator.enabled && extra.firebase.emulator.host;
    const apiKey =
      Platform.OS === 'android' ? extra.firebase.apiKeyAndroid : extra.firebase.apiKeyiOS;
    const app = firebase.initializeApp({ ...extra.firebase, apiKey });
    this.authentication = app.auth();
    this.firestore = app.firestore();
    this.functions = app.functions(extra.firebase.region);

    if (emulated) {
      const host = extra.firebase.emulator.host!;
      this.authentication.useEmulator(`http://${host}:9099`);
      this.functions.useEmulator(host, 5001);
      this.firestore.useEmulator(host, 8080);
      this.storage = app.storage('gs://default-bucket');
      this.storage.useEmulator(host, 9199);
    } else {
      this.storage = app.storage();
    }

    this._refs = new FirebaseRefs(this.functions, this.firestore);
    this._iugu = new IuguApi(extra.iugu.accountId, extra.environment !== 'live');
    this._files = new FilesApi(this.storage);
    this._auth = new AuthApi(this._refs, this.authentication, extra);
    this._platform = new PlatformApi(this._refs, this._files);
    this._profile = new ProfileApi(this.firestore, this._auth, extra.flavor);
    this._courier = new CourierApi(this._refs, this._files);
    this._fleet = new FleetApi(this._refs);
    this._consumer = new ConsumerApi(this._refs, this._iugu);
    this._order = new OrderApi(this._refs, this.firestore);
    this._maps = new MapsApi(extra.googleMapsApiKey);
    this._business = new BusinessApi(this._refs, this._files);
    this._search = new SearchApi(extra.algolia, extra.environment);
    this._user = new UserApi(this._refs, extra.flavor);
  }

  auth() {
    return this._auth;
  }

  platform() {
    return this._platform;
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

  user() {
    return this._user;
  }

  async signOut() {
    const userId = this.auth().getUserId();
    if (this.profile().flavor === 'courier' && userId) {
      await this.profile().updateProfile(userId, {
        status: 'unavailable',
      } as Partial<CourierProfile>);
    }
    await this.auth().signOut();
  }

  async deleteAccount(payload: Partial<DeleteAccountPayload>) {
    await this.auth().deleteAccount(payload);
    await this.signOut();
  }

  async getServerTime(): Promise<number> {
    const result = await this._refs.getServerTimeCallable()();
    return result.data.time;
  }
}
