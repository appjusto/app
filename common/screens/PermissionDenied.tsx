import { RouteProp } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React from 'react';
import { Text } from 'react-native';
import { t } from '../../strings';
import DefaultButton from '../components/buttons/DefaultButton';
import PaddedView from '../components/containers/PaddedView';
import { track, useSegmentScreen } from '../store/api/track';
import { borders, colors, padding, screens, texts } from '../styles';

export type PermissionDeniedParamList = {
  PermissionDenied: {
    title: string;
    subtitle: string;
  };
};

type ScreenRouteProp = RouteProp<PermissionDeniedParamList, 'PermissionDenied'>;

type Props = {
  route: ScreenRouteProp;
};

export const PermissionDenied = ({ route }: Props) => {
  const { title, subtitle } = route.params;
  // handlers
  const openSettings = (): void => {
    track('Opened device settings');
    Linking.openSettings();
  };
  // side effects
  // tracking
  useSegmentScreen('PermissionDenied', { title });
  // UI
  return (
    <PaddedView style={{ ...screens.config, paddingTop: padding }}>
      <Text style={{ ...texts.x2l }}>{title}</Text>
      <Text style={{ ...texts.sm, color: colors.grey700, marginVertical: 32 }}>{subtitle}</Text>
      <DefaultButton
        title={t('Acessar configurações do dispositivo')}
        onPress={openSettings}
        style={{ ...borders.default }}
      />
    </PaddedView>
  );
};
