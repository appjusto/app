import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import React from 'react';

import { motocycle } from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { colors, borders } from '../../../common/styles';
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
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: 'white' }}
      />
    </FeedbackView>
  );
};
