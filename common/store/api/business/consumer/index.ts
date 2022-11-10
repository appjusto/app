import { IuguCreatePaymentTokenData } from '@appjusto/types/payment/iugu';
import { CancelToken } from 'axios';
import { t } from '../../../../../strings';
import { getAppVersion } from '../../../../utils/version';
import { FunctionsRef } from '../../../refs/FunctionsRef';
import { StoragePaths } from '../../../refs/StoragePaths';
import FilesApi from '../../files';
import IuguApi from '../../payment/iugu';

export default class ConsumerApi {
  constructor(
    private functionsRef: FunctionsRef,
    private iugu: IuguApi,
    private storagePaths: StoragePaths,
    private files: FilesApi,
    private emulated: boolean
  ) {}

  async saveCard(data: IuguCreatePaymentTokenData, cancelToken?: CancelToken) {
    const paymentToken = await this.iugu.createPaymentToken(data, cancelToken);
    if (!paymentToken) throw new Error(t('Não foi possível salvar o cartão de crédito.'));
    const result = await this.functionsRef.getSavePaymentTokenCallable()({
      paymentToken,
      meta: { version: getAppVersion() },
    });
    return result.data;
  }

  async deletePaymentMethod(paymentMethodId: string) {
    return (
      await this.functionsRef.getDeletePaymentMethodCallable()({
        paymentMethodId,
        meta: { version: getAppVersion() },
      })
    ).data;
  }
  // storage
  // selfie
  uploadSelfie(id: string, localUri: string, progressHandler?: (progress: number) => void) {
    return this.files.upload(
      this.functionsRef.getConsumerSelfieStoragePath(id),
      localUri,
      progressHandler
    );
  }
  fetchSelfie(id: string, size?: string) {
    console.log('FETCH SELFIE');
    return this.files.getDownloadURL(
      this.functionsRef.getConsumerSelfieStoragePath(id, !this.emulated && size ? size : undefined)
    );
  }
  // document
  uploadDocumentImage(
    id: string,
    localUri: string,

    progressHandler?: (progress: number) => void
  ) {
    return this.files.upload(
      this.functionsRef.getConsumerDocumentStoragePath(id),
      localUri,
      progressHandler
    );
  }
  fetchDocumentImage(id: string, size?: string) {
    return this.files.getDownloadURL(
      this.functionsRef.getConsumerDocumentStoragePath(
        id,
        !this.emulated && size ? size : undefined
      )
    );
  }
}
