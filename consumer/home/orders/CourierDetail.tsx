import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { getOrderById } from '../../../common/store/order/selectors';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
import { formatDate } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';
import OrderFleetCard from './OrderFleetCard';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'CourierDetail'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'CourierDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  const { orderId, fleet } = route.params ?? {};
  //context
  const api = useContext(ApiContext);
  const order = useSelector(getOrderById)(orderId)!;

  //screen state
  const createdOn = (order.courier!.joined as firebase.firestore.Timestamp).toDate();

  const tallerDevice = useTallerDevice();

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <View>
        <PaddedView style={{ ...screens.default }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: padding }}>
            <View>
              <RoundedProfileImg flavor="courier" id={order.courier!.id} />
            </View>
            <View style={{ marginLeft: tallerDevice ? 24 : 12 }}>
              <Text style={{ ...texts.medium }}>{order.courier?.name}</Text>
              <Text style={{ ...texts.small, color: colors.darkGrey, marginTop: 8 }}>
                {t('No appJusto desde')}
              </Text>
              <Text style={{ ...texts.small }}>{formatDate(createdOn, 'monthYear')}</Text>
            </View>
          </View>
          <DefaultButton
            title={t('Iniciar um chat com o entregador')}
            style={{ marginBottom: 8 }}
            onPress={() => navigation.navigate('Chat', { orderId })}
          />
          <DefaultButton
            title={t('Relatar um problema')}
            onPress={() => {}}
            style={{ ...borders.default, borderColor: colors.black, backgroundColor: colors.white }}
          />
        </PaddedView>
        <HR height={8} />
        <View style={{ paddingVertical: padding }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
          >
            <Pill />
            <Text style={{ ...texts.medium, ...texts.bold, marginLeft: 12 }}>
              {t('Mais informações')}
            </Text>
          </View>
          <View style={{ marginTop: 12, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Entregas realizadas perfeitamente')}
            </Text>
            <Text style={{ ...texts.medium }}>{order.courier?.statistics.deliveries}</Text>
          </View>
          <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Entregas canceladas')}
            </Text>
            <Text style={{ ...texts.medium }}>{order.courier?.statistics.canceled}</Text>
          </View>
          <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Tempo médio das entregas')}
            </Text>
            <Text style={{ ...texts.medium }}>
              {order.courier?.statistics.avgDeliveryTime ?? 0}
            </Text>
          </View>
          <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Média das gorjetas recebidas por entrega')}
            </Text>
            <Text style={{ ...texts.medium }}>{order.courier?.statistics.avgTipReceived ?? 0}</Text>
          </View>
          <PaddedView>
            <Text style={{ ...texts.small, color: colors.darkGrey, marginVertical: 8 }}>
              {t('Integrante da frota')}
            </Text>
            <OrderFleetCard fleet={fleet} />
          </PaddedView>
        </View>
      </View>
    </ScrollView>
  );
}
