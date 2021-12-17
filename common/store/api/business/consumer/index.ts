import { DeletePaymentMethodPayload, SavePaymentTokenPayload } from '@appjusto/types';
import { IuguCreatePaymentTokenData } from '@appjusto/types/payment/iugu';
import { CancelToken } from 'axios';
import { t } from '../../../../../strings';
import { getAppVersion } from '../../../../utils/version';
import FirebaseRefs from '../../FirebaseRefs';
import IuguApi from '../../payment/iugu';

type SaveCardResult = {
  paymentMethodId: string;
};

export default class ConsumerApi {
  constructor(private refs: FirebaseRefs, private iugu: IuguApi) {}

  async saveCard(
    data: IuguCreatePaymentTokenData,
    cancelToken?: CancelToken
  ): Promise<SaveCardResult> {
    const paymentToken = await this.iugu.createPaymentToken(data, cancelToken);
    if (!paymentToken) throw new Error(t('Não foi possível salvar o cartão de crédito.'));
    const payload: SavePaymentTokenPayload = {
      paymentToken,
      meta: { version: getAppVersion() },
    };
    const result = await this.refs.getSavePaymentTokenCallable()(payload);
    return result.data;
  }

  async deletePaymentMethod(paymentMethodId: string) {
    const payload: DeletePaymentMethodPayload = {
      paymentMethodId,
      meta: { version: getAppVersion() },
    };
    return (await this.refs.getDeletePaymentMethodCallable()(payload)).data;
  }
}
