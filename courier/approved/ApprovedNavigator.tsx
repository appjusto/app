import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { PlatformParamsContextProvider } from '../../common/contexts/PlatformParamsContext';
import { GetServerTimeContextProvider } from '../../common/contexts/ServerTimeContext';
import { PermissionDenied } from '../../common/screens/PermissionDenied';
import { defaultScreenOptions } from '../../common/screens/options';
import { AddressComplete } from '../../consumer/v2/common/AddressComplete';
import { RecommendRestaurant } from '../../consumer/v2/food/restaurant/recommend/RecommendRestaurant';
import { RecommendationFeedback } from '../../consumer/v2/food/restaurant/recommend/RecommendationFeedback';
import { t } from '../../strings';
import MainNavigator from './main/MainNavigator';
import { ComplaintFeedbackScreen } from './main/complaint/ComplaintFeedbackScreen';
import { ComplaintScreen } from './main/complaint/ComplaintScreen';
import DeliveriesNavigator from './main/history/DeliveriesNavigator';
import { HowAppJustoWorksNavigator } from './main/howitworks/HowAppJustoWorksNavigator';
import PaymentNavigator from './main/payment/PaymentNavigator';
import ProfileNavigator from './main/profile/ProfileNavigator';
import MatchingNavigator from './matching/MatchingNavigator';
import { RejectedMatchingFeedback } from './matching/RejectedMatchingFeedback';
import { DeliveryProblemFeedback } from './ongoing/DeliveryProblemFeedback';
import OngoingDeliveryNavigator from './ongoing/OngoingDeliveryNavigator';
import { DropOrderFeedback } from './ongoing/delivery-problem/DropOrderFeedback';
import { ApprovedParamList } from './types';

const Stack = createStackNavigator<ApprovedParamList>();
export default function () {
  return (
    <PlatformParamsContextProvider>
      <GetServerTimeContextProvider>
        <Stack.Navigator screenOptions={defaultScreenOptions}>
          <Stack.Screen
            name="MainNavigator"
            component={MainNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MatchingNavigator"
            component={MatchingNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OngoingDeliveryNavigator"
            component={OngoingDeliveryNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DeliveriesNavigator"
            component={DeliveriesNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PaymentNavigator"
            component={PaymentNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileNavigator"
            component={ProfileNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PermissionDenied"
            component={PermissionDenied}
            options={{ title: t('Compartilhar sua localização') }}
          />
          <Stack.Screen
            name="DeliveryProblemFeedback"
            component={DeliveryProblemFeedback}
            options={{ title: t('Tive um problema') }}
          />
          <Stack.Screen
            name="DropOrderFeedback"
            component={DropOrderFeedback}
            options={{ title: t('Tive um problema') }}
          />
          <Stack.Screen
            name="RejectedMatchingFeedback"
            component={RejectedMatchingFeedback}
            options={{ title: t('Informações enviadas') }}
          />
          <Stack.Screen
            name="HowAppJustoWorksNavigator"
            component={HowAppJustoWorksNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ComplaintScreen"
            component={ComplaintScreen}
            options={{ title: t('Denúncia') }}
          />
          <Stack.Screen
            name="ComplaintFeedbackScreen"
            component={ComplaintFeedbackScreen}
            options={{ title: t('Denúncia') }}
          />
          <Stack.Screen
            name="RecommendRestaurant"
            component={RecommendRestaurant}
            options={{ title: t('Indicar restaurante') }}
          />
          <Stack.Screen
            name="RecommendationFeedback"
            component={RecommendationFeedback}
            options={{ title: t('Confirmação da indicação') }}
          />
          <Stack.Screen
            name="AddressComplete"
            component={AddressComplete}
            options={{ title: t('Indicar restaurante') }}
          />
        </Stack.Navigator>
      </GetServerTimeContextProvider>
    </PlatformParamsContextProvider>
  );
}
