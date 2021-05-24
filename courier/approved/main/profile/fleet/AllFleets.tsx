import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import { useSearchFleets } from '../../../../../common/store/api/search/useSearchFleets';
import { useSegmentScreen } from '../../../../../common/store/api/track';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierProfileParamList } from '../types';
import { CourierFleetCard } from './components/CourierFleetCard';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'AllFleets'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // screen state
  const [fleetSearch, setFleetSearch] = useState('');
  const { fleets, fetchNextPage } = useSearchFleets(fleetSearch);
  // side effects
  // tracking
  useSegmentScreen('All Fleets');
  // handlers
  const navigateFleetDetail = (fleetId: string) => {
    navigation.navigate('FleetDetail', { fleetId });
  };
  // UI
  if (!fleets) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={fleets}
        ListHeaderComponent={
          <View style={{ marginBottom: 32, paddingHorizontal: padding, paddingTop: padding }}>
            <Text style={{ ...texts.x2l }}>{t('Escolha sua frota')}</Text>
            <Text
              style={{
                ...texts.sm,
                color: colors.grey700,
              }}
            >
              {t(
                'Você pode escolhar a frota que deseja fazer parte. Frotas com mais participantes tem mais chances de corridas melhores.'
              )}
            </Text>
            <DefaultInput
              value={fleetSearch}
              title={t('Buscar')}
              placeholder={t('Nome da frota')}
              onChangeText={setFleetSearch}
              style={{ marginBottom: 24, marginTop: padding }}
            />
            <Text style={{ ...texts.sm }}>
              {fleets.length} {t('frotas disponíveis')}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: padding, marginBottom: padding }}>
            <CourierFleetCard fleet={item} listItem onPress={() => navigateFleetDetail(item.id)} />
          </View>
        )}
        onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}
