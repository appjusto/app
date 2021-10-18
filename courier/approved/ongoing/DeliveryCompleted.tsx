import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
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
  // context
  const { fee } = route.params;
  // screen state
  const clientFeedbackData: HorizontalSelectItem[] = [
    { title: t('Sim, tudo certo'), id: '1' },
    { title: t('Não, longa espera'), id: '2' },
  ];
  const [selectedClientFeedback, setSelectedClientFeedback] = useState<HorizontalSelectItem>(
    clientFeedbackData[0]
  );
  // side effects
  // tracking
  useSegmentScreen('DeliveryCompleted');
  // handlers
  // TODO: add a handler to send client feedback to database
  // UI
  return (
    <PaddedView style={{ ...screens.default }}>
      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <IconMotocycle />
        <Text style={{ ...texts.x2l, marginVertical: 16 }}>{t('Corrida finalizada!')}</Text>
        <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Valor recebido')}</Text>
        <Text style={{ ...texts.x2l, marginTop: 4 }}>{formatCurrency(fee)}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ marginBottom: 42 }}>
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>
          {t('Tudo certo no cliente?')}
        </Text>
        <HorizontalSelect
          data={clientFeedbackData}
          selected={selectedClientFeedback}
          onSelect={setSelectedClientFeedback}
        />
      </View>
      <DefaultButton
        title={t('Finalizar')}
        onPress={() => {
          track('navigating Home');
          navigation.replace('MainNavigator', { screen: 'Home' });
        }}
        style={{ marginTop: padding }}
      />
    </PaddedView>
  );
}
