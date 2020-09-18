import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Fleet } from 'appjusto-types';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Text, FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import { getCourier } from '../../../../common/store/courier/selectors';
import { fetchApprovedFleets } from '../../../../common/store/fleet/actions';
import { getAvailableCities, getApprovedFleets } from '../../../../common/store/fleet/selectors';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { texts, screens, colors, padding } from '../../../../common/styles';
import { t } from '../../../../strings';
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
  const courier = useSelector(getCourier);
  const availableCities = useSelector(getAvailableCities);
  const approvedFleets = useSelector(getApprovedFleets);

  // screen state
  // const [selectedCity, setSelectedCity] = useState<City>();
  const [selectedFleet, setSelectedFleet] = useState<Fleet>();

  // effects
  // fetch available cities
  useEffect(() => {
    //   if (availableCities === undefined) dispatch(fetchAvailableCities(api));
    dispatch(fetchApprovedFleets(api));
  }, []);
  // when available cities are fetched, select the first one
  // useEffect(() => {
  //   if (availableCities) setSelectedCity(availableCities[0]);
  // }, [availableCities]);
  // fetch available fleets for selected city
  // useEffect(() => {
  //   if (selectedCity != null) dispatch(fetchApprovedFleets(api));
  // }, [selectedCity]);
  // when approved fleets are fetched, select courier's
  useEffect(() => {
    const courierFleet = approvedFleets?.find((fleet) => fleet.id === courier!.fleet?.id);
    if (courierFleet !== undefined) {
      setSelectedFleet(courierFleet);
    }
  }, [approvedFleets]);

  // handers
  const confirmFleet = useCallback(async () => {
    // TODO: change fleet
    await dispatch(updateProfile(api)(courier!.id!, { fleet: selectedFleet }));
    navigation.goBack();
  }, [selectedFleet]);

  // UI
  return (
    <View style={{ ...screens.configScreen }}>
      <FlatList
        data={approvedFleets?.slice(0, 5) ?? []}
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
          <PaddedView>
            <Text style={{ ...texts.big }}>{t('Cidade de atuação')}</Text>
            <Text style={{ ...texts.default, marginTop: 16, color: colors.darkGrey }}>
              {t('Escolha a cidade que você vai fazer suas entregas')}
            </Text>
            <DefaultInput
              title={t('Cidades disponíveis')}
              placeholder={t('Pesquise sua cidade')}
              style={{ marginTop: 16 }}
            />
            <DefaultButton
              style={{ marginTop: 8 }}
              title={t('Minha cidade não está disponível')}
              disabled={availableCities === undefined}
              activityIndicator={busy}
              onPress={() => navigation.navigate('CityUnavailable')}
            />
            <Text style={{ ...texts.big, marginTop: padding }}>{t('Escolha sua frota')}</Text>
            <Text style={{ ...texts.default, marginTop: padding, color: colors.darkGrey }}>
              {t(
                'Faça parte de uma frota existente ou crie sua própria frota. Frotas com mais participantes tem mais chances de corridas melhores.'
              )}
            </Text>
          </PaddedView>
        }
        ListFooterComponent={
          <PaddedView>
            <DefaultButton
              title={t('Criar uma nova frota')}
              onPress={() => navigation.navigate('CreateFleet')}
            />
          </PaddedView>
        }
      />
    </View>
  );
}
