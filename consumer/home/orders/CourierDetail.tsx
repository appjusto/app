import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { ImageURISource, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedIcon, { ProfileIcon } from '../../../common/components/icons/RoundedIcon';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { getSelfieURL } from '../../../common/store/courier/actions';
import { getOrderById } from '../../../common/store/order/selectors';
import { colors, padding, screens, texts } from '../../../common/styles';
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
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector(getOrderById)(orderId)!;

  //screen state
  const [selfie, setSelfie] = useState<ImageURISource | undefined | null>();

  //look for the method to get the selfie

  // // side effects
  // useEffect(() => {
  //   (async () => {
  //     console.log(orderId);
  //   })();
  // }, []);

  const tallerDevice = useTallerDevice();

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <View>
        <PaddedView style={{ ...screens.default }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: padding }}>
            <View>
              <RoundedIcon icon={selfie ?? icons.user} size={64} />
            </View>
            <View style={{ marginLeft: tallerDevice ? 24 : 12 }}>
              <Text style={{ ...texts.medium }}>{order.courier?.name}</Text>
              <Text style={{ ...texts.small, color: colors.darkGrey, marginTop: 8 }}>
                {t('No appJusto desde')}
              </Text>
              <Text style={{ ...texts.small }}>{t('Outubro, 20')}</Text>
            </View>
          </View>
          <DefaultButton
            title={t('Iniciar um chat com o entregador')}
            style={{ marginBottom: 8 }}
            onPress={() => {}}
          />
          <DefaultButton title={t('Relatar um problema')} isWhite onPress={() => {}} />
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
            <Text style={{ ...texts.medium }}>{t('000')}</Text>
          </View>
          <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Entregas canceladas')}
            </Text>
            <Text style={{ ...texts.medium }}>{t('000')}</Text>
          </View>
          <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Tempo médio das entregas')}
            </Text>
            <Text style={{ ...texts.medium }}>{t('000')}</Text>
          </View>
          <View style={{ marginTop: 16, alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {t('Média das gorjetas recebidas por entrega')}
            </Text>
            <Text style={{ ...texts.medium }}>{t('000')}</Text>
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
