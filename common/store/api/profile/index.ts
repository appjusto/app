import {
  ConsumerProfile,
  CourierProfile,
  Flavor,
  ManagerProfile,
  UserProfile,
  WithId,
} from '@appjusto/types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { hash } from 'geokit';
import { Platform } from 'react-native';
import { getInstallationId } from '../../../utils/getInstallationId';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import AuthApi from '../auth';
import { fetchPublicIP } from '../externals/ipify';
import { documentAs } from '../types';

export default class ProfileApi {
  constructor(private firestoreRefs: FirestoreRefs, private auth: AuthApi, public flavor: Flavor) {}

  // private helpers
  private getProfileRef(id: string) {
    return this.firestoreRefs.getProfileCollection(this.flavor).doc(id);
  }
  private async createProfile(id: string) {
    console.log(`Creating ${this.flavor} profile...`);
    await this.getProfileRef(id).set(
      {
        situation: 'pending',
        email: this.auth.getEmail() ?? null,
        phone: this.auth.getPhoneNumber(true) ?? null,
        createdOn:
          FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      } as Partial<UserProfile>,
      { merge: true }
    );
  }

  // firestore
  // observe profile changes
  observeProfile(id: string, resultHandler: (profile: WithId<UserProfile>) => void) {
    return this.getProfileRef(id).onSnapshot(
      async (snapshot) => {
        if (!snapshot.exists) {
          const unsub = this.getProfileRef(id).onSnapshot(
            { includeMetadataChanges: true },
            (snapshotWithMetadata) => {
              if (!snapshotWithMetadata.metadata.hasPendingWrites) {
                resultHandler(documentAs<UserProfile>(snapshotWithMetadata));
                unsub();
              }
            }
          );
          await this.createProfile(id);
        } else resultHandler(documentAs<UserProfile>(snapshot));
      },
      (error) => {
        console.error('observeProfile', id);
        console.error(error);
        // Sentry.Native.captureException(error);
      }
    );
  }

  // update profile
  async updateProfile(
    id: string,
    changes: Partial<CourierProfile> | Partial<ConsumerProfile> | Partial<ManagerProfile>,
    retry: number = 5
  ) {
    const appVersion = `${Application.nativeApplicationVersion}${
      Constants.manifest ? ` / ${Constants.manifest.version}` : ''
    }`;
    return new Promise<void>(async (resolve) => {
      const installationId = await getInstallationId();
      const ip = this.flavor === 'consumer' ? await fetchPublicIP() : null;
      const update: Partial<UserProfile> = {
        ...changes,
        appVersion,
        appInstallationId: installationId,
        appIp: ip,
        platform: Platform.OS,
        updatedOn:
          FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
      };
      try {
        await this.getProfileRef(id).set(update, { merge: true });
        resolve();
      } catch (error: any) {
        if (retry > 0) {
          setTimeout(async () => resolve(await this.updateProfile(id, changes, retry - 1)), 2000);
        } else {
          console.error('Erro ao tentar atualizar o perfil:', JSON.stringify(update));
          console.error(error);
          // Sentry.Native.captureException(error);
          resolve();
        }
      }
    });
  }

  async updateLocation(id: string, location: FirebaseFirestoreTypes.GeoPoint, retry: number = 5) {
    const update: Partial<UserProfile> = {
      coordinates: location,
      g: {
        geopoint: location,
        geohash: hash({
          lat: location.latitude,
          lng: location.longitude,
        }),
      },
      updatedOn:
        FirebaseFirestoreTypes.FieldValue.serverTimestamp() as FirebaseFirestoreTypes.Timestamp,
    };
    console.log(id, update);
    await this.updateProfile(id, update);
  }
}
