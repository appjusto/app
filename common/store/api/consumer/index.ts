import { Card, WithId } from '@appjusto/types';
import { IuguCreatePaymentTokenData } from '@appjusto/types/payment/iugu';
import { CancelToken } from 'axios';
import * as Crypto from 'expo-crypto';
import { onSnapshot, query, where } from 'firebase/firestore';
import * as Sentry from 'sentry-expo';
import { t } from '../../../../strings';
import { getAppVersion } from '../../../utils/version';
import { FirestoreRefs } from '../../refs/FirestoreRefs';
import { FunctionsRef } from '../../refs/FunctionsRef';
import { StoragePaths } from '../../refs/StoragePaths';
import FilesApi from '../files';
import IuguApi from '../payment/iugu';
import { documentsAs } from '../types';
export default class ConsumerApi {
  constructor(
    private firestoreRefs: FirestoreRefs,
    private functionsRef: FunctionsRef,
    private iugu: IuguApi,
    private storagePaths: StoragePaths,
    private files: FilesApi,
    private emulated: boolean
  ) {}

  async observeCards(consumerId: string, resultHandler: (orders: WithId<Card>[]) => void) {
    return onSnapshot(
      query(
        this.firestoreRefs.getCardsRef(),
        where('accountId', '==', consumerId),
        where('status', '==', 'enabled')
      ),
      (querySnapshot) => {
        if (querySnapshot.empty) resultHandler([]);
        else resultHandler(documentsAs<Card>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  async saveIuguCard(data: IuguCreatePaymentTokenData, cancelToken?: CancelToken) {
    const paymentToken = await this.iugu.createPaymentToken(data, cancelToken);
    if (!paymentToken) throw new Error(t('Não foi possível salvar o cartão de crédito.'));
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data.number);
    const result = await this.functionsRef.getSaveIuguCardCallable()({
      cardTokenId: paymentToken.id,
      cardHash: hash,
      meta: { version: getAppVersion() },
    });
    return result.data;
  }

  async deleteIuguCard(id: string) {
    return (
      await this.functionsRef.getDeleteIuguCardCallable()({
        id,
        meta: { version: getAppVersion() },
      })
    ).data;
  }
  // storage
  // selfie
  uploadSelfie(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      this.storagePaths.getConsumerSelfieStoragePath(id),
      localUri,
      progressHandler
    );
  }
  fetchSelfie(id: string, size?: string) {
    return this.files.getDownloadURL(
      this.storagePaths.getConsumerSelfieStoragePath(id, !this.emulated && size ? size : undefined)
    );
  }
  // document
  uploadDocumentImage(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      this.storagePaths.getConsumerDocumentStoragePath(id),
      localUri,
      progressHandler
    );
  }
  fetchDocumentImage(id: string, size?: string) {
    return this.files.getDownloadURL(
      this.storagePaths.getConsumerDocumentStoragePath(
        id,
        !this.emulated && size ? size : undefined
      )
    );
  }
}
