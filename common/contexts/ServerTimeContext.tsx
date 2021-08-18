import React from 'react';
import { useServerTime } from '../utils/platform/useServerTime';

interface Result {
  getServerTime: () => Date;
}

const GetServerTimeContext = React.createContext<Result | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const GetServerTimeContextProvider = (props: Props) => {
  const getServerTime = useServerTime();
  const result = { getServerTime };
  return (
    <GetServerTimeContext.Provider value={result}>{props.children}</GetServerTimeContext.Provider>
  );
};

export const useContextGetSeverTime = () => {
  const context = React.useContext(GetServerTimeContext);
  if (!context) return null;
  return context.getServerTime;
};
