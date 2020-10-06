import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as icons from '../../../assets/icons';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedIcon, { ProfileIcon } from '../../../common/components/icons/RoundedIcon';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import useTallerDevice from '../../../common/hooks/useTallerDevice';
import { colors, padding, screens, texts } from '../../../common/styles';
import FleetCard from '../../../courier/approved/main/profile/fleet/FleetCard';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'CourierDetail'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'CourierDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  const { courierId, fleet } = route.params ?? {};

  //look for the method to get the selfie

  //side effects
  useEffect(() => {
    console.log(courierId);
  }, [courierId]);
  //get the courierId
  const tallerDevice = useTallerDevice();

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <View>
        <PaddedView style={{ ...screens.default }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: padding }}>
            <View>
              <RoundedIcon icon={icons.user} size={64} />
            </View>
            <View style={{ marginLeft: tallerDevice ? 24 : 12 }}>
              <Text style={{ ...texts.medium }}>{t('Daniel')}</Text>
              <Text style={{ ...texts.small, color: colors.darkGrey, marginTop: 8 }}>
                {t('No appJusto desde')}
              </Text>
              <Text style={{ ...texts.small }}>{t('Setembro, 2020')}</Text>
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
          <Text style={{ ...texts.small, color: colors.darkGrey, marginTop: 24 }}>
            {t('Integrante da frota')}
          </Text>
          <View>{/* <FleetCard /> */}</View>
        </View>
      </View>
    </ScrollView>
  );
}
