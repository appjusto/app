import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React from 'react';
import { Text } from 'react-native';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, borders, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HomeParamList, 'PermissionDeniedFeedback'>;
type ScreenRouteProp = RouteProp<HomeParamList, 'PermissionDeniedFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default (props: Props) => {
  // handlers
  const openSettings = (): void => {
    Linking.openSettings();
  };

  // UI
  return (
    <PaddedView style={{ ...screens.configScreen }}>
      <Text style={{ ...texts.big }}>
        {t('Precisamos acessar a localização do seu dispositivo')}
      </Text>
      <Text style={{ ...texts.default, color: colors.darkGrey, marginVertical: 32 }}>
        {t(
          'Para que possamos determinar o trajeto das corridas, precisamos que você dê acesso ao AppJusto para usar a localização do seu dispositivo.'
        )}
      </Text>
      <DefaultButton
        title={t('Acessar configurações do dispositivo')}
        onPress={openSettings}
        style={{ ...borders.default }}
      />
    </PaddedView>
  );
};
