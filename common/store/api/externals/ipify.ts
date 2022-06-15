import axios, { CancelToken } from 'axios';

interface Result {
  ip: string;
}

let ip: string;

export const fetchPublicIP = async (cancelToken?: CancelToken) => {
  if (ip) return ip;
  const url = 'https://api.ipify.org/?format=json';
  try {
    const response = await axios.get<Result>(url, { cancelToken });
    ip = response.data.ip;
    return ip;
  } catch (error: any) {
    return undefined;
  }
};
