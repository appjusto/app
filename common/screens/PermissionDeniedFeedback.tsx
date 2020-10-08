import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { Text } from 'react-native';

import { HomeParamList } from '../../courier/approved/main/home/types';
import { t } from '../../strings';
import DefaultButton from '../components/buttons/DefaultButton';
import PaddedView from '../components/containers/PaddedView';
import { colors, borders, screens, texts, padding } from '../styles';

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
    <PaddedView style={{ ...screens.configScreen, paddingTop: padding }}>
      <Text style={{ ...texts.big }}>{title}</Text>
      <Text style={{ ...texts.default, color: colors.darkGrey, marginVertical: 32 }}>
        {subtitle}
      </Text>
      <DefaultButton
        title={t('Acessar configurações do dispositivo')}
        onPress={openSettings}
        style={{ ...borders.default }}
      />
    </PaddedView>
  );
};
