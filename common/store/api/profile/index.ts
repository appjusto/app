import { ConsumerProfile, CourierProfile, Flavor, UserProfile, WithId } from '@appjusto/types';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import {
  doc,
  Firestore,
  GeoPoint,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { hash } from 'geokit';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import AuthApi from '../auth';
import { documentAs } from '../types';

export default class ProfileApi {
  private collectionName: string;
  constructor(private firestore: Firestore, private auth: AuthApi, public flavor: Flavor) {
    this.collectionName = this.flavor === 'consumer' ? 'consumers' : 'couriers';
  }

  // private helpers
  private getProfileRef(id: string) {
    return doc(this.firestore, this.collectionName, id);
  }
  private async createProfile(id: string) {
    console.log(`Creating ${this.flavor} profile...`);
    await setDoc(
      this.getProfileRef(id),
      {
        situation: 'pending',
        email: this.auth.getEmail() ?? null,
        phone: this.auth.getPhoneNumber(true) ?? null,
        createdOn: serverTimestamp(),
      } as UserProfile,
      { merge: true }
    );
  }

  // firestore
  // observe profile changes
  observeProfile(id: string, resultHandler: (profile: WithId<UserProfile>) => void): Unsubscribe {
    return onSnapshot(
      this.getProfileRef(id),
      async (snapshot) => {
        if (!snapshot.exists()) {
          const unsub = onSnapshot(
            this.getProfileRef(id),
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
        console.log('error');
        Sentry.Native.captureException(error);
      }
    );
  }

  // update profile
  async updateProfile(
    id: string,
    changes: Partial<CourierProfile> | Partial<ConsumerProfile>,
    retry: number = 5
  ) {
    const appVersion = `${Application.nativeApplicationVersion}${
      Constants.manifest ? ` / ${Constants.manifest.version}` : ''
    }`;
    return new Promise<void>(async (resolve) => {
      try {
        const update: Partial<UserProfile> = {
          ...changes,
          appVersion,
          platform: Platform.OS,
          updatedOn: serverTimestamp(),
        };
        // console.log(update);
        await setDoc(this.getProfileRef(id), update, { merge: true });
        resolve();
      } catch (error: any) {
        if (retry > 0) {
          setTimeout(async () => resolve(await this.updateProfile(id, changes, retry - 1)), 2000);
        } else {
          console.error('Erro ao tentar atualizar o perfil:', JSON.stringify(error));
          // Sentry.Native.captureException(error);
          resolve();
        }
      }
    });
  }

  async updateLocation(id: string, location: GeoPoint, retry: number = 5) {
    return new Promise<void>(async (resolve) => {
      try {
        await updateDoc(doc(this.firestore, this.collectionName, id), {
          coordinates: location,
          g: {
            geopoint: location,
            geohash: hash({
              lat: location.latitude,
              lng: location.longitude,
            }),
          },
          updatedOn: serverTimestamp(),
        } as Partial<UserProfile>);
      } catch (error: any) {
        if (retry > 0) {
          setTimeout(async () => resolve(await this.updateLocation(id, location, retry - 1)), 1000);
        } else {
          console.error(
            `Erro ao tentar atualizar a localização: ${JSON.stringify(location)}`,
            JSON.stringify(error)
          );
          // Sentry.Native.captureException(error);
          resolve();
        }
      }
    });
  }
}
