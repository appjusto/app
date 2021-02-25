import { IuguCreatePaymentTokenData } from 'appjusto-types/payment/iugu';
import { CancelToken } from 'axios';
import FirebaseRefs from '../../FirebaseRefs';
import IuguApi from '../../payment/iugu';

type SaveCardResult = {
  paymentMethodId: string;
};

export default class ConsumerApi {
  constructor(private refs: FirebaseRefs, private iugu: IuguApi) {}

  async saveCard(
    cpf: string,
    data: IuguCreatePaymentTokenData,
    cancelToken?: CancelToken
  ): Promise<SaveCardResult> {
    const paymentToken = await this.iugu.createPaymentToken(data, cancelToken);
    const result = await this.refs.getSavePaymentTokenCallable()({ paymentToken, cpf });
    return result.data;
  }

  async deletePaymentMethod(paymentMethodId: string) {
    return (await this.refs.getDeletePaymentMethodCallable()({ paymentMethodId })).data;
  }
}
