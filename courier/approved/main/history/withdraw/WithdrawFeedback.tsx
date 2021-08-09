import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../../../common/icons/icon-motocycle';
import { colors, padding } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { DeliveriesNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<
  DeliveriesNavigatorParamList,
  'RequestWithdrawFeedback'
>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'RequestWithdrawFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const WithdrawFeedback = ({ navigation, route }: Props) => {
  return (
    <FeedbackView
      header={route.params.header}
      icon={<IconMotocycle />}
      background={colors.white}
      description={route.params.description}
    >
      <DefaultButton
        title={t('Voltar para sua conta')}
        onPress={() => navigation.popToTop()}
        style={{ paddingBottom: padding }}
      />
    </FeedbackView>
  );
};
