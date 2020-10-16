import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet, WithId } from 'appjusto-types';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Text, FlatList, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import HR from '../../../../../common/components/views/HR';
import ShowIf from '../../../../../common/components/views/ShowIf';
import useFleets from '../../../../../common/hooks/useFleets';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { observeFleets } from '../../../../../common/store/fleet/actions';
import { updateProfile } from '../../../../../common/store/user/actions';
import { texts, screens, colors, padding } from '../../../../../common/styles';
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
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const courier = useSelector(getCourier)!;
  const [fleets, query] = useFleets();

  // screen state
  // const [selectedCity, setSelectedCity] = useState<City>();
  const [selectedFleet, setSelectedFleet] = useState<WithId<Fleet>>();

  // effects
  // once
  // observe fleets
  useEffect(() => {
    return dispatch(observeFleets(api));
  }, []);
  // when fleets are fetched
  // select courier's fleet if he has selected it already
  useEffect(() => {
    const courierFleet = fleets.find((fleet) => fleet.id === courier.fleet?.id);
    if (courierFleet !== undefined) {
      setSelectedFleet(courierFleet);
    }
  }, [fleets]);

  // handlers
  const confirmFleet = useCallback(async () => {
    if (!selectedFleet) return;
    await dispatch(updateProfile(api)(courier.id, { fleet: selectedFleet }));
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
                selected={item === selectedFleet}
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
              <ShowIf test={query.isLoading}>
                {() => <ActivityIndicator size="large" color={colors.black} />}
              </ShowIf>
              <ShowIf test={fleets.length > 0}>
                {() => (
                  <Text style={{ ...texts.mediumToBig }}>
                    {t('Frotas com mais participantes: ')}
                  </Text>
                )}
              </ShowIf>
            </PaddedView>
          </View>
        }
        onEndReached={() => query.fetchMore()}
      />
    </View>
  );
}
