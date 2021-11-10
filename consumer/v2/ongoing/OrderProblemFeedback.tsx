import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { DeliveredOrderNavigatorParamList } from '../delivered/types';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    OngoingOrderNavigatorParamList & DeliveredOrderNavigatorParamList,
    'OrderProblemFeedback'
  >,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OrderProblemFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderProblemFeedback = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  const order = useObserveOrder(orderId);
  // tracking
  useSegmentScreen('OrderProblemFeedback');
  // handler
  const goBackHandler = () => {
    if (order?.status === 'delivered') {
      navigation.goBack();
    } else {
      navigation.replace('OngoingOrder', { orderId });
    }
  };
  // UI
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <FeedbackView
      header={t('Aguarde enquanto estamos analisando o seu problema.')}
      icon={<IconMotocycle />}
      background={colors.grey50}
      description={t(
        'Em breve entraremos em contato com você para relatar a resolução do seu problema.'
      )}
    >
      <DefaultButton
        title={t('Voltar')}
        onPress={goBackHandler}
        style={{ paddingBottom: padding }}
      />
    </FeedbackView>
  );
};
