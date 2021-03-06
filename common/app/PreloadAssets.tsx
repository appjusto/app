import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { ReactElement, useState } from 'react';
import fonts from '../../assets/fonts';
import icons from '../../assets/icons';

export interface Props {
  children: () => ReactElement;
}

export default function ({ children }: Props) {
  const preloadAssets = async (): Promise<void> => {
    await Font.loadAsync(fonts);
    await Asset.loadAsync(icons);
  };
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  if (!assetsLoaded) {
    return (
      <AppLoading
        startAsync={preloadAssets}
        onFinish={() => {
          setAssetsLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }

  return children();
}
