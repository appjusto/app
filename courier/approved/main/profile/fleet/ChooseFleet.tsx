import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import useObserveFleet from '../../../../../common/store/api/fleet/hooks/useObserveFleet';
import { useSegmentScreen } from '../../../../../common/store/api/track';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { formatDate } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { CourierProfileParamList } from '../types';
import { CourierFleetCard } from './components/CourierFleetCard';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'ChooseFleet'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'ChooseFleet'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // redux store
  const courier = useSelector(getCourier)!;
  // state
  const fleet = useObserveFleet(courier.fleet!.id);
  // side effects
  // tracking
  useSegmentScreen('Choose Fleet');
  // UI
  if (!fleet) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
      <View style={{ flex: 1 }}>
        <PaddedView>
          <Text style={{ ...texts.x2l, marginBottom: padding }}>{t('Sua frota atual')}</Text>
          {courier.fleet!.joinedOn && (
            <Text
              style={{
                ...texts.sm,
                color: colors.grey700,
                marginBottom: 24,
              }}
            >
              {`${t('Você está nessa frota desde')} ${formatDate(courier.fleet!.joinedOn)} `}
            </Text>
          )}
          <CourierFleetCard fleet={fleet} />
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
