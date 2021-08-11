import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../../common/icons/icon-cone-yellow';
import { colors, padding } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ApprovedParamList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'DropOrderFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const DropOrderFeedback = ({ navigation }: Props) => {
  return (
    <FeedbackView
      header={t('Você foi removido do pedido')}
      icon={<IconConeYellow />}
      background={colors.grey50}
      description={t('Como o pedido não foi retirado, você não receberá nada do valor da entrega.')}
    >
      <DefaultButton
        title={t('Voltar')}
        onPress={() => navigation.navigate('MainNavigator', { screen: 'Home' })}
        style={{ paddingBottom: padding }}
      />
    </FeedbackView>
  );
};
