import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { Text } from 'react-native';
import { HomeParamList } from '../../courier/approved/main/home/types';
import { t } from '../../strings';
import DefaultButton from '../components/buttons/DefaultButton';
import PaddedView from '../components/containers/PaddedView';
import { borders, colors, padding, screens, texts } from '../styles';

type ScreenNavigationProp = StackNavigationProp<HomeParamList, 'PermissionDeniedFeedback'>;
type ScreenRouteProp = RouteProp<HomeParamList, 'PermissionDeniedFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  const { title, subtitle } = route.params;
  // handlers
  const openSettings = (): void => {
    Linking.openSettings();
  };

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
