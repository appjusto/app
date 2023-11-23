import { Card, LedgerEntry, Place, WithId } from '@appjusto/types';
import { CancelToken } from 'axios';
import { getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { trim } from 'lodash';
import * as Sentry from 'sentry-expo';
import { LedgerEntryStatus } from '../../../../../types';
import { CardInfo } from '../../../../consumer/v2/main/profile/cards/types';
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

  // places
  observePlaces(consumerId: string, resultHandler: (orders: WithId<Place>[]) => void) {
    return onSnapshot(
      query(
        this.firestoreRefs.getCardsRef(),
        where('accountId', '==', consumerId),
        orderBy('updatedAt', 'desc')
      ),
      (querySnapshot) => {
        if (querySnapshot.empty) resultHandler([]);
        else resultHandler(documentsAs<Place>(querySnapshot.docs));
      },
      (error) => {
        console.error(error);
        Sentry.Native.captureException(error);
      }
    );
  }

  // cards
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

  async saveCard(data: CardInfo, cancelToken?: CancelToken) {
    const { processor, name, number, month, year, cvv } = data;
    if (processor === 'iugu') {
      const firstName = trim(name.split(' ', 1).toString());
      const lastName = trim(name.split(' ').splice(1).join(' '));
      const paymentToken = await this.iugu.createPaymentToken(
        {
          first_name: firstName,
          last_name: lastName,
          number,
          month,
          year,
          verification_value: cvv,
        },
        cancelToken
      );
      if (!paymentToken) throw new Error(t('Não foi possível salvar o cartão de crédito.'));
      const result = await this.functionsRef.getSaveCardCallable()({
        processor: 'iugu',
        cardTokenId: paymentToken.id,
        meta: { version: getAppVersion() },
      });
      return result.data;
    } else if (processor === 'vr') {
      const result = await this.functionsRef.getSaveCardCallable()({
        processor: 'vr',
        name,
        number,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        cvv,
        meta: { version: getAppVersion() },
      });
      return result.data;
    }
    throw new Error('Não foi possível identificar a bandeira.');
  }

  async deleteCard(id: string) {
    return (
      await this.functionsRef.getDeleteCardCallable()({
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

  async fetchCredits(consumerId: string) {
    const snapshot = await getDocs(
      query(
        this.firestoreRefs.getLedgerRef(),
        where('status', '==', 'approved' as LedgerEntryStatus),
        where('to.accountType', '==', 'consumer'),
        where('to.accountId', '==', consumerId)
      )
    );
    if (snapshot.empty) return 0;
    return documentsAs<LedgerEntry>(snapshot.docs).reduce((total, entry) => total + entry.value, 0);
  }
}
