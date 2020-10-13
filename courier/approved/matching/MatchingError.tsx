import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { borders, colors } from '../../../common/styles';
import { t } from '../../../strings';
import { MatchingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<MatchingParamList, 'MatchingError'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default ({ navigation }: Props) => {
  // handlers
  const popToTop = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  // UI
  return (
    <FeedbackView
      header={t('Esse pedido já foi aceito por outro entregador :(')}
      icon={icons.coneYellow}
    >
      <DefaultButton title={t('Voltar para o início')} onPress={popToTop} secondary />
    </FeedbackView>
  );
};
