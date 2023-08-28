import { IssueType } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Linking, ScrollView, View } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors, screens } from '../../../common/styles';
import { DeliveryProblemCard } from '../../../courier/approved/ongoing/delivery-problem/DeliveryProblemCard';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderProblem'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderProblem'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export const OngoingOrderProblem = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // screen state
  const order = useObserveOrder(orderId);
  // tracking
  useSegmentScreen('OngoingOrderProblem');
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handlers and helpers
  const { type, dispatchingState, status } = order;
  const navigateToReportIssue = (issueType: IssueType, orderId: string) => {
    navigation.navigate('ReportIssue', {
      issueType,
      orderId,
    });
  };
  const reportIssueHandler = () => {
    if (type === 'food') {
      if (status === 'delivered') {
        navigateToReportIssue('consumer-delivered-food-order', orderId);
      } else if (dispatchingState === 'going-destination') {
        navigateToReportIssue('consumer-ongoing-food', orderId);
      } else if (dispatchingState === 'arrived-destination') {
        navigateToReportIssue('consumer-arrived-food-order', orderId);
      } else {
        navigateToReportIssue('consumer-going-pickup-food', orderId);
      }
    } else if (type === 'p2p') {
      if (status === 'delivered') {
        navigateToReportIssue('consumer-delivered-p2p-order', orderId);
      } else if (dispatchingState === 'going-destination') {
        navigateToReportIssue('consumer-ongoing-p2p', orderId);
      } else if (dispatchingState === 'arrived-destination') {
        navigateToReportIssue('consumer-arrived-p2p-order', orderId);
      } else {
        navigateToReportIssue('consumer-going-pickup-p2p', orderId);
      }
    }
  };
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
        {/* goes to a screen with a ReportIssueView */}
        <DeliveryProblemCard
          title={t('Problema com o pedido')}
          subtitle={t('Informe o seu problema')}
          onPress={reportIssueHandler}
          situation="consumer-problem"
        />
        {/* open whatsapp chat */}
        <DeliveryProblemCard
          title={t('Preciso falar com o AppJusto')}
          subtitle={t('Abrir chat no WhatsApp')}
          onPress={() => {
            track('opening whatsapp chat with backoffice');
            Linking.openURL(AppJustoAssistanceWhatsAppURL);
          }}
          situation="chat"
        />
        {/* commented for now. will be added back later when we have this feature */}
        {/* <DeliveryProblemCard
          title={t('Estou com o problema urgente')}
          subtitle={t('O AppJusto vai ligar para você')}
          onPress={() => null}
          situation="urgent"
        /> */}
      </PaddedView>
    </ScrollView>
  );
};
