import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import ShowIf from '../../../../../common/components/views/ShowIf';
import { useSearchFleets } from '../../../../../common/store/api/search/useSearchFleets';
import { colors, padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import FleetItem from './FleetItem';
import { FleetParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<FleetParamList, 'AllFleets'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context

  // screen state
  const [fleetSearch, setFleetSearch] = useState('');
  const { fleets, isLoading, fetchNextPage } = useSearchFleets(fleetSearch);

  // handlers
  const navigateFleetDetail = React.useCallback((fleetId) => {
    navigation.navigate('FleetDetail', { fleetId });
  }, []);

  // UI
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={fleets}
        ListHeaderComponent={
          <View style={{ marginBottom: 32, paddingHorizontal: padding }}>
            <DefaultInput
              // defaultValue={initialAddress}
              value={fleetSearch}
              title={t('Buscar')}
              placeholder={t('Nome da frota')}
              onChangeText={setFleetSearch}
              style={{ marginBottom: 32, marginTop: padding }}
            />
            <ShowIf test={!fleets && isLoading}>
              {() => (
                <View style={{ marginTop: 8 }}>
                  <ActivityIndicator size="small" color={colors.white} />
                </View>
              )}
            </ShowIf>
          </View>
        }
        renderItem={({ item }) => (
          <FleetItem
            onPress={() => navigateFleetDetail(item.id)}
            name={item.name}
            participants={item.participantsOnline}
            description={item.description}
            minimumFee={item.minimumFee}
            feePerKm={item.additionalPerKmAfterThreshold}
          />
        )}
        onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}
