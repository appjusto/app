import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React from 'react';

import { motocycle } from '../../../assets/icons';
import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import FeedbackView from '../../common/FeedbackView';
import { colors, borders } from '../../common/styles';
import { HomeStackParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'PermissionDeniedFeedback'>;
type ScreenRouteProp = RouteProp<HomeStackParamList, 'PermissionDeniedFeedback'>;

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
    <FeedbackView
      header={t('Precisamos acessar a localização do seu dispositivo.')}
      description={t(
        'Para que possamos determinar o trajeto das corridas, precisamos que você dê acesso ao AppJusto para usar a localização do seu dispositivo.'
      )}
      icon={motocycle}
    >
      <DefaultButton
        title={t('Acessar cofigurações do dispositivo')}
        onPress={openSettings}
        styleObject={{ ...borders.default, borderColor: colors.black, backgroundColor: 'white' }}
      />
    </FeedbackView>
  );
};
