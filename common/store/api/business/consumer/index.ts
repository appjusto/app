import { FunctionsRef } from '@appjusto/firebase-refs';
import { IuguCreatePaymentTokenData } from '@appjusto/types/payment/iugu';
import { CancelToken } from 'axios';
import { t } from '../../../../../strings';
import { getAppVersion } from '../../../../utils/version';
import IuguApi from '../../payment/iugu';

export default class ConsumerApi {
  constructor(private functionsRef: FunctionsRef, private iugu: IuguApi) {}

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
}
