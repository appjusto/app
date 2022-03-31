import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import fonts from '../../assets/fonts';
import icons from '../../assets/icons';
import { colors, screens } from '../styles';

export interface Props {
  children: () => React.ReactNode;
}

export default function ({ children }: Props) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  React.useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (error: any) {
        console.warn(error);
      }
      await Font.loadAsync(fonts);
      await Asset.loadAsync(icons);
      setAssetsLoaded(true);
    })();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (assetsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [assetsLoaded]);

  if (!assetsLoaded) return null;

  return (
    <View style={screens.default} onLayout={onLayoutRootView}>
      {assetsLoaded ? children() : <ActivityIndicator size="small" color={colors.white} />}
    </View>
  );
}
