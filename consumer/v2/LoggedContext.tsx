import { PlatformParams } from '@appjusto/types';
import React from 'react';
import { usePlatformParams } from '../../common/utils/platform/usePlatformParams';
import { useServerTime } from '../../common/utils/platform/useServerTime';

interface Result {
  platformParams: PlatformParams | undefined;
  getServerTime: () => Date;
}

const LoggedContext = React.createContext<Result | undefined>(undefined);

interface LoggedContextProps {
  children: React.ReactNode;
}

export const LoggedContextProvider = (props: LoggedContextProps) => {
  const platformParams = usePlatformParams();
  const getServerTime = useServerTime();
  const result = { platformParams, getServerTime };
  return <LoggedContext.Provider value={result}>{props.children}</LoggedContext.Provider>;
};

export const useLoggedContextGetServerTime = () => {
  const context = React.useContext(LoggedContext);
  if (!context) {
    throw new Error('useLoggedContext must be used within the ApiProvider');
  }
  return context.getServerTime;
};

export const useLoggedContextPlatformParams = () => {
  const context = React.useContext(LoggedContext);
  if (!context) {
    throw new Error('useLoggedContext must be used within the ApiProvider');
  }
  return context.platformParams;
};
