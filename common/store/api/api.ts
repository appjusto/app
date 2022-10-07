// eslint-disable-next-line import/order
// import FirebaseRefs from './FirebaseRefs';
import { CourierProfile, DeleteAccountPayload } from '@appjusto/types';
import { getApp, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, Functions, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, FirebaseStorage, getStorage } from 'firebase/storage';
import { Platform } from 'react-native';
import { Extra } from '../../../config/types';
import { FirestoreRefs } from '../refs/FirestoreRefs';
import { FunctionsRef } from '../refs/FunctionsRef';
import { StoragePaths } from '../refs/StoragePaths';
import AuthApi from './auth';
import BusinessApi from './business';
import BusinessesGeoSearchApi from './business/BusinessesGeoSearchApi';
import ConsumerApi from './business/consumer';
import CourierApi from './courier';
import FilesApi from './files';
import FleetApi from './fleet';
import GeoFirestoreApi from './GeoFirestoreApi';
import MapsApi from './maps';
import OrderApi from './order';
import IuguApi from './payment/iugu';
import PlatformApi from './platform';
import ProfileApi from './profile';
import ReviewsApi from './reviews';
import SearchApi from './search/SearchApi';
import UserApi from './users';

export default class Api {
  private authentication: Auth;
  private firestore: Firestore;
  private functions: Functions;
  private storage: FirebaseStorage;

  private _firestoreRefs: FirestoreRefs;
  private _functionsRefs: FunctionsRef;
  private _storagePaths: StoragePaths;
  private _auth: AuthApi;
  private _platform: PlatformApi;
  private _profile: ProfileApi;
  private _courier: CourierApi;
  private _fleet: FleetApi;
  private _consumer: ConsumerApi;
  private _order: OrderApi;
  private _reviews: ReviewsApi;
  private _maps: MapsApi;
  private _files: FilesApi;
  private _iugu: IuguApi;
  private _business: BusinessApi;
  private _businessesGeoSearch: BusinessesGeoSearchApi;
  private _search: SearchApi;
  private _user: UserApi;

  constructor(extra: Extra) {
    const emulated = extra.firebase.emulator.enabled && extra.firebase.emulator.host;
    const apiKey =
      Platform.OS === 'android' ? extra.firebase.apiKeyAndroid : extra.firebase.apiKeyiOS;
    const app = initializeApp({ ...extra.firebase, apiKey });
    this.authentication = getAuth(app);
    this.firestore = getFirestore(app);
    this.functions = getFunctions(app, extra.firebase.region);
    this.storage = getStorage(app);

    if (emulated) {
      const host = extra.firebase.emulator.host!;
      connectAuthEmulator(this.authentication, `http://${host}:9099`);
      connectFirestoreEmulator(this.firestore, host, 8080);
      connectFunctionsEmulator(this.functions, host, 5001);
      connectStorageEmulator(this.storage, host, 9199);
    }
    this._firestoreRefs = new FirestoreRefs();
    this._functionsRefs = new FunctionsRef(this.functions);
    this._storagePaths = new StoragePaths();
    this._iugu = new IuguApi(extra.iugu.accountId, extra.environment !== 'live');
    this._files = new FilesApi(this.storage);
    this._auth = new AuthApi(this.authentication, this._firestoreRefs, this._functionsRefs, extra);
    this._platform = new PlatformApi(this._firestoreRefs, this._files);
    this._profile = new ProfileApi(this.firestore, this._auth, extra.flavor);
    this._courier = new CourierApi(
      this._firestoreRefs,
      this._functionsRefs,
      this._storagePaths,
      this._files,
      !!emulated
    );
    this._fleet = new FleetApi(this._firestoreRefs);
    this._consumer = new ConsumerApi(this._functionsRefs, this._iugu);
    this._order = new OrderApi(this._firestoreRefs, this._functionsRefs, this.firestore);
    this._reviews = new ReviewsApi(this._firestoreRefs);
    this._maps = new MapsApi(this._functionsRefs);
    this._business = new BusinessApi(this._firestoreRefs, this._storagePaths, this._files);
    this._businessesGeoSearch = new BusinessesGeoSearchApi(new GeoFirestoreApi(extra));
    this._search = new SearchApi(extra.algolia, extra.environment);
    this._user = new UserApi(this._firestoreRefs, extra.flavor);
  }

  getFirebaseOptions() {
    return getApp().options;
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

  reviews() {
    return this._reviews;
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

  businessesGeoSearch() {
    return this._businessesGeoSearch;
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
    const result = await this._functionsRefs.getServerTimeCallable()();
    return (result.data as any).time;
  }
}
