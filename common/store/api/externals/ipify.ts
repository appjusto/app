import axios, { CancelToken } from 'axios';

interface Result {
  ip: string;
}

export const fetchPublicIP = async (cancelToken?: CancelToken) => {
  const url = 'https://api.ipify.org/?format=json';
  try {
    const response = await axios.get<Result>(url, { cancelToken });
    return response.data.ip;
  } catch (error: any) {
    return undefined;
  }
};
