import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ApiContext } from '../../app/context';

interface DeltaInfo {
  delta: number;
  updatedOn: Date;
}
const KEY = 'server-time';
const THRESHOLD = 1000 * 60 * 60 * 24; // day
const retrieve = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    if (value) {
      const info = JSON.parse(value) as DeltaInfo;
      return { ...info, updatedOn: new Date(info.updatedOn) } as DeltaInfo;
    }
  } catch (error: any) {}
  return null;
};

const store = async (delta: number) => {
  try {
    const now = new Date();
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({
        delta,
        updatedOn: now,
      } as DeltaInfo)
    );
  } catch (error: any) {}
};

const expired = (info: DeltaInfo | null) => {
  if (!info) return true;
  const now = new Date();
  // console.log(info);
  return now.getTime() - info.updatedOn.getTime() > THRESHOLD;
};

export const useServerTime = () => {
  const api = React.useContext(ApiContext);
  const [delta, setDelta] = React.useState<number>(0);
  React.useEffect(() => {
    (async () => {
      const info = await retrieve();
      // console.log('Info:', info);
      if (expired(info)) {
        const serverTime = await api.getServerTime();
        const newDelta = serverTime - new Date().getTime();
        console.log('Atualizando o sever time com delta de ', newDelta);
        await store(newDelta);
        setDelta(newDelta);
      } else {
        console.log('Recuperando o delta de server time', info!.delta);
        setDelta(info!.delta);
      }
    })();
  }, [api]);
  return () => new Date(new Date().getTime() + delta);
};
