import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import Pill from '../../../common/components/views/Pill';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors, doublePadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { AppJustoAssistanceWhatsAppURL } from '../../../strings/values';
import { ApprovedParamList } from '../types';
import { DeliveryCompletedIcon } from './completed/completed';
import { DeliveryProblemCard } from './delivery-problem/DeliveryProblemCard';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'DeliveryCompleted'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'DeliveryCompleted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { fee, orderId } = route.params;
  // tracking
  useSegmentScreen('DeliveryCompleted');
  // handlers
  // UI
  return (
    <ScrollView style={{ ...screens.default }} scrollIndicatorInsets={{ right: 1 }}>
      <View
        style={{
          paddingHorizontal: padding,
          paddingVertical: 80,
          alignItems: 'center',
          backgroundColor: colors.primary,
        }}
      >
        <DeliveryCompletedIcon />
        <View
          style={{
            paddingHorizontal: doublePadding,
            marginTop: doublePadding,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              ...texts.xl,
              marginBottom: doublePadding,
            }}
          >
            Corrida finalizada!
          </Text>
          <Text
            style={{
              ...texts.xs,
              color: colors.grey800,
              textAlign: 'center',
              marginBottom: 4,
            }}
          >
            Valor recebido
          </Text>
          <Text
            style={{
              ...texts.lg,
              textAlign: 'center',
            }}
          >
            {formatCurrency(fee)}
          </Text>
        </View>
      </View>
      <View>
        <PaddedView>
          <View style={{ position: 'absolute', top: padding }}>
            <Pill />
          </View>
          <Text style={{ ...texts.md }}>Teve algum problema com a corrida?</Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            Mande uma menasgem para o nosso time ou faça uma denúncia
          </Text>
          <View style={{ marginTop: padding }}>
            <DeliveryProblemCard
              title={t('Falar com nosso time')}
              subtitle={t('Envie uma mensagem para o nosso WhatsApp')}
              onPress={() => {
                track('Falar com atendente', { screen: 'NeedHelpModal' });
                Linking.openURL(AppJustoAssistanceWhatsAppURL);
              }}
              situation="chat"
            />
            <DeliveryProblemCard
              title={t('Realizar uma denúncia')}
              subtitle={t('Nos informe se você sofreu algum tipo de discriminação')}
              onPress={() => {}}
              situation="courier-problem"
            />
          </View>
          <DefaultButton
            title={t('Finalizar')}
            onPress={() => {
              navigation.replace('MainNavigator', { screen: 'Home' });
            }}
            style={{ marginTop: padding }}
          />
        </PaddedView>
      </View>
    </ScrollView>
  );
}
