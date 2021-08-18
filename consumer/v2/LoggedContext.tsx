import React from 'react';
import { PlatformParamsContextProvider } from '../../common/contexts/PlatformParamsContext';
import { GetServerTimeContextProvider } from '../../common/contexts/ServerTimeContext';

interface Props {
  children: React.ReactNode;
}

export const LoggedContextProvider = (props: Props) => {
  return (
    <PlatformParamsContextProvider>
      <GetServerTimeContextProvider>{props.children}</GetServerTimeContextProvider>
    </PlatformParamsContextProvider>
  );
};
