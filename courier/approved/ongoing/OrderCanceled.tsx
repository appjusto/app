import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { borders, colors } from '../../../common/styles';
import { t } from '../../../strings';
import { OngoingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OngoingParamList, 'OrderCanceled'>;

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
    <FeedbackView header={t('Este pedido foi cancelado pelo cliente.')} icon={icons.coneYellow}>
      <DefaultButton
        title={t('Voltar para o início')}
        onPress={popToTop}
        style={{ ...borders.default, borderColor: colors.black, backgroundColor: 'white' }}
      />
    </FeedbackView>
  );
};
