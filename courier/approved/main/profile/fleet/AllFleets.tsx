import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet } from 'appjusto-types';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';

import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import ShowIf from '../../../../../common/components/views/ShowIf';
import useFleets from '../../../../../common/hooks/queries/useFleets';
import { screens, colors, padding } from '../../../../../common/styles';
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
  const [fleetName, setFleetName] = useState('');
  const [fleetSearch, setFleetSearch] = useState('');
  const [fleets, query] = useFleets(fleetSearch);

  // side effects
  const updateFleetSearch = useCallback(
    debounce((input: string) => {
      setFleetSearch(input);
    }, 500),
    []
  );
  useEffect(() => {
    updateFleetSearch(fleetName);
  }, [fleetName]);

  // handlers
  const navigateFleetDetail = useCallback((fleet: Fleet) => {
    navigation.navigate('FleetDetail', { fleet });
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
              value={fleetName}
              title={t('Buscar')}
              placeholder={t('Nome da frota')}
              onChangeText={setFleetName}
              style={{ marginBottom: 32, marginTop: padding }}
            />
            <ShowIf test={fleets.length === 0 && query.isLoading}>
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
            onPress={() => navigateFleetDetail(item)}
            name={item.name}
            participants={item.participantsOnline}
            description={item.description}
            minimumFee={item.minimumFee}
            feePerKm={item.additionalPerKmAfterThreshold}
          />
        )}
        onEndReached={() => query.fetchMore()}
      />
    </View>
  );
}
