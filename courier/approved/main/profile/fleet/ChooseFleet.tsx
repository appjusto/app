import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet, WithId } from 'appjusto-types';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Text, FlatList, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import ShowIf from '../../../../../common/components/views/ShowIf';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { fetchApprovedFleets } from '../../../../../common/store/fleet/actions';
import { getAvailableCities, getApprovedFleets } from '../../../../../common/store/fleet/selectors';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../../common/store/user/actions';
import { texts, screens, colors, padding, borders } from '../../../../../common/styles';
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
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;
  const approvedFleets = useSelector(getApprovedFleets) ?? [];

  // screen state
  // const [selectedCity, setSelectedCity] = useState<City>();
  const [selectedFleet, setSelectedFleet] = useState<WithId<Fleet>>();

  // effects
  // once
  // fetch fleets
  useEffect(() => {
    dispatch(fetchApprovedFleets(api));
  }, []);
  // when fleets are fetched
  // select courier's fleet if he has selected it already
  useEffect(() => {
    const courierFleet = approvedFleets?.find((fleet) => fleet.id === courier.fleet?.id);
    if (courierFleet !== undefined) {
      setSelectedFleet(courierFleet);
    }
  }, [approvedFleets]);

  // handlers
  const confirmFleet = useCallback(async () => {
    if (!selectedFleet) return;
    await dispatch(updateProfile(api)(courier.id, { fleet: selectedFleet }));
    navigation.goBack();
  }, [selectedFleet]);

  // UI
  return (
    <View style={{ ...screens.configScreen }}>
      <FlatList
        data={approvedFleets?.slice(0, 10) ?? []}
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
          <View>
            <PaddedView>
              <Text style={{ ...texts.big, marginTop: padding }}>{t('Escolha sua frota')}</Text>
              <Text
                style={{
                  ...texts.default,
                  marginTop: padding,
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
                title={t('Criar uma nova frota')}
                onPress={() => navigation.navigate('CreateFleet')}
                style={{
                  ...borders.default,
                  borderColor: colors.black,
                  backgroundColor: 'white',
                  marginTop: 8,
                }}
              />
            </PaddedView>
            <View
              style={{
                marginTop: 40,
                borderColor: colors.grey,
                borderStyle: 'solid',
                borderWidth: 1,
              }}
            />
            <Text style={{ marginTop: 24, ...texts.mediumToBig, paddingHorizontal: padding }}>
              {t('Frotas com mais participantes: ')}
            </Text>
            <ShowIf test={approvedFleets.length === 0 && busy}>
              {() => (
                <View style={{ marginTop: 8 }}>
                  <ActivityIndicator size="small" color={colors.white} />
                </View>
              )}
            </ShowIf>
          </View>
        }
      />
    </View>
  );
}
