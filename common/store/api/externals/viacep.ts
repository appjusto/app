import axios, { CancelToken } from 'axios';

type ViaCEPResultError = {
  error: true;
};

type ViaCEPResultSuccess = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  error: undefined;
};

type ViaCEPResult = ViaCEPResultError | ViaCEPResultSuccess;

export const fetchPostalDetails = async (cep: string, cancelToken?: CancelToken) => {
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await axios.get<ViaCEPResult>(url, { cancelToken });
  return response.data;
};
