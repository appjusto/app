import { PlatformParams } from '@appjusto/types';
import React from 'react';
import { usePlatformParams } from '../utils/platform/usePlatformParams';

interface Result {
  platformParams: PlatformParams | undefined;
}

const PlatformParamsContext = React.createContext<Result | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const PlatformParamsContextProvider = (props: Props) => {
  const platformParams = usePlatformParams();
  const result = { platformParams };
  return (
    <PlatformParamsContext.Provider value={result}>{props.children}</PlatformParamsContext.Provider>
  );
};

export const usePlatformParamsContext = () => {
  const context = React.useContext(PlatformParamsContext);
  if (!context) return null;
  return context.platformParams;
};
