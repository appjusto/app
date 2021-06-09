import axios, { CancelToken } from 'axios';

export interface IBGEState {
  sigla: string;
}

export interface IBGECity {
  nome: string;
}

const baseURL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export const fetchBrazilianStates = async (cancelToken?: CancelToken) => {
  const response = await axios.get<IBGEState[]>(baseURL, { cancelToken });
  return response.data;
};

export const fetchBrazilianCitiesByState = async (state: string, cancelToken?: CancelToken) => {
  const response = await axios.get<IBGECity[]>(`${baseURL}/${state}/municipios`, { cancelToken });
  return response.data;
};
