import {
  IuguCreatePaymentTokenData,
  IuguCreatePaymentToken,
  IuguPaymentToken,
} from 'appjusto-types/payment/iugu';
import axios, { AxiosError, CancelToken } from 'axios';

const API_ENDPOINT = 'https://api.iugu.com/v1';

export default class IuguApi {
  constructor(private accountId: string) {}

  async createPaymentToken(
    data: IuguCreatePaymentTokenData,
    cancelToken?: CancelToken
  ): Promise<IuguPaymentToken | null> {
    const url = `${API_ENDPOINT}/payment_token`;
    const payload: IuguCreatePaymentToken = {
      account_id: this.accountId,
      method: 'credit_card',
      test: true, // TODO: remove
      data,
    };
    try {
      const response = await axios.post<IuguPaymentToken>(url, payload, { cancelToken });
      return response.data;
    } catch (error) {
      let message = 'Não foi possível completar a requisição.';
      if (error.response?.data?.errors?.number) {
        message = 'Número do cartão inválido';
      }
      throw new Error(message);
    }
  }
}
