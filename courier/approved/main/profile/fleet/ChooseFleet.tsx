import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierFleetCard } from './components/CourierFleetCard';
import { FleetParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<FleetParamList, 'ChooseFleet'>;
type ScreenRouteProp = RouteProp<FleetParamList, 'ChooseFleet'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // redux store
  const courier = useSelector(getCourier)!;

  // UI
  if (!courier.fleet) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  return (
    <ScrollView style={{ ...screens.config }}>
      <View style={{ flex: 1 }}>
        <PaddedView>
          <Text style={{ ...texts.x2l, marginBottom: padding }}>{t('Sua frota atual')}</Text>
          <Text
            style={{
              ...texts.sm,
              color: colors.grey700,
              marginBottom: 24,
            }}
          >
            {t('Você está nessa frota desde 00/00/0000')}
          </Text>
          <CourierFleetCard fleet={courier.fleet} />
          <View style={{ marginTop: 24 }}>
            <DefaultButton
              title={t('Veja todas as frotas disponíveis')}
              onPress={() => navigation.navigate('AllFleets')}
            />
            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Criar uma nova frota')}
              onPress={() => navigation.navigate('CreateFleet')}
              secondary
            />
          </View>
        </PaddedView>
      </View>
    </ScrollView>
  );
}
