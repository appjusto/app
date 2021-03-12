import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { Image } from 'react-native';
import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { t } from '../../../strings';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OngoingOrderNavigatorParamList, 'OrderCanceled'>;

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
      header={t('Este pedido foi cancelado pelo cliente.')}
      icon={<Image source={icons.coneYellow} />}
    >
      <DefaultButton title={t('Voltar para o início')} onPress={popToTop} secondary />
    </FeedbackView>
  );
};
