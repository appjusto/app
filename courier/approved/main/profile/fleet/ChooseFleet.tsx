import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet, WithId } from 'appjusto-types';
import React, { useCallback, useContext, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import HR from '../../../../../common/components/views/HR';
import ShowIf from '../../../../../common/components/views/ShowIf';
import { useSearchFleets } from '../../../../../common/store/api/search/useSearchFleets';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import FleetCard from './FleetCard';
import { FleetParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<FleetParamList, 'ChooseFleet'>;
type ScreenRouteProp = RouteProp<FleetParamList, 'ChooseFleet'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  // redux store
  const courier = useSelector(getCourier)!;
  // screen state
  const [availableFleets] = useState('');
  const { fleets, fetchNextPage } = useSearchFleets(availableFleets);
  const [selectedFleet, setSelectedFleet] = useState<WithId<Fleet>>();
  // side effects
  React.useEffect(() => {
    if (!fleets) return;
    const courierFleet = fleets.find((fleet) => fleet.id === courier.fleet?.id);
    if (courierFleet) setSelectedFleet(courierFleet);
  }, [fleets]);
  console.log(fleets);

  // handlers
  const confirmFleet = useCallback(async () => {
    if (!selectedFleet) return;
    api.profile().updateProfile(courier.id, { fleet: selectedFleet });
    navigation.goBack();
  }, [selectedFleet]);
  // UI
  return (
    <View style={{ ...screens.config }}>
      <FlatList
        data={fleets}
        renderItem={({ item }) => {
          return (
            <PaddedView>
              <FleetCard
                fleet={item}
                selected={item.id === selectedFleet?.id}
                couriersFleet={item.id === courier.fleet?.id}
                onSelect={() => setSelectedFleet(item)}
                onConfirm={confirmFleet}
              />
            </PaddedView>
          );
        }}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ flex: 1 }}>
            <PaddedView>
              <Text
                style={{
                  ...texts.default,
                  color: colors.darkGrey,
                  marginBottom: 24,
                }}
              >
                {t(
                  'Faça parte de uma frota existente ou crie sua própria frota. Frotas com mais participantes tem mais chances de corridas melhores.'
                )}
              </Text>
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
            </PaddedView>
            <HR color={colors.grey} />
            <PaddedView>
              <ShowIf test={fleets === undefined}>
                {() => <ActivityIndicator size="large" color={colors.black} />}
              </ShowIf>
              <ShowIf test={Boolean(fleets?.length)}>
                {() => (
                  <Text style={{ ...texts.mediumToBig }}>
                    {t('Frotas com mais participantes: ')}
                  </Text>
                )}
              </ShowIf>
            </PaddedView>
          </View>
        }
        onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}
