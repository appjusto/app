import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import { ProfileIcon } from '../../../common/components/icons/RoundedIcon';
import HR from '../../../common/components/views/HR';
import { getOrderById } from '../../../common/store/order/selectors';
import { halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import { HomeNavigatorParamList } from '../types';
import PlaceSummary from './p2p-order/PlaceSummary';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeNavigatorParamList, 'OrderConfirmedFeedback'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderConfirmedFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // context
  const { orderId } = route.params;
  // app state
  const order = useSelector(getOrderById)(orderId)!;
  // screen state
  const courierFeedbackOptions: HorizontalSelectItem[] = [
    { title: t('Sim, tudo certo'), id: '1' },
    { title: t('Não, tive um problema'), id: '2' },
  ];
  const tipOptions: HorizontalSelectItem[] = [
    { id: '0', title: t('Sem gorjeta'), data: 0 },
    { id: '1', title: formatCurrency(100), data: 100 },
    { id: '3', title: formatCurrency(300), data: 300 },
    { id: '5', title: formatCurrency(500), data: 500 },
    { id: '8', title: formatCurrency(800), data: 800 },
    { id: '10', title: formatCurrency(1000), data: 1000 },
    { id: '15', title: formatCurrency(1500), data: 1500 },
    { id: '30', title: formatCurrency(3000), data: 3000 },
  ];
  const [selectedCourierFeedback, setSelectedCourierFeedback] = useState(courierFeedbackOptions[0]);
  const [selectedTip, setSelectedTip] = useState(tipOptions[0]);
  // UI
  const paddingTop = Constants.statusBarHeight;
  return (
    <View style={{ flex: 1 }}>
      <PaddedView style={{ ...screens.default, paddingTop }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[texts.big]}>{t('Pedido\nentregue')}</Text>
          <Image source={icons.motocycle} />
        </View>
        <PlaceSummary place={order.origin} title={t('Retirada')} />
        <PlaceSummary place={order.destination} title={t('Entrega')} />
        <View style={{ marginVertical: padding }}>
          <HR />
        </View>
        <Text style={[texts.big]}>{t('Seu pedido foi entregue\ncorretamente?')}</Text>
        <View style={{ marginTop: padding }}>
          <HorizontalSelect
            data={courierFeedbackOptions}
            selected={selectedCourierFeedback}
            onSelect={setSelectedCourierFeedback}
          />
        </View>
        <View style={{ marginTop: padding }}>
          <View style={{ flexDirection: 'row' }}>
            <ProfileIcon />
            <View style={{ marginLeft: halfPadding }}>
              <Text style={[texts.medium]}>
                {t('Gorjeta para')} {order.courier!.name}
              </Text>
              <Text style={[texts.small]}>
                {t('Valorize ainda mais o trabalho do seu entregador')}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: halfPadding }}>
            <HorizontalSelect data={tipOptions} selected={selectedTip} onSelect={setSelectedTip} />
          </View>
        </View>
        <View style={{ marginTop: padding }}>
          <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} />
        </View>
      </PaddedView>
    </View>
  );
};
