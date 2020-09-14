import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Text, FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import PaddedView from '../../../../common/components/views/PaddedView';
import { fetchAvailableCities, fetchApprovedFleets } from '../../../../common/store/fleet/actions';
import { getAvailableCities, getApprovedFleets } from '../../../../common/store/fleet/selectors';
import { Fleet, City } from '../../../../common/store/fleet/types';
import { getUIBusy } from '../../../../common/store/ui/selectors';
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

  // state
  const busy = useSelector(getUIBusy);
  const availableCities = useSelector(getAvailableCities);
  const approvedFleets = useSelector(getApprovedFleets);

  // screen state
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);

  // effects
  // fetch available cities
  useEffect(() => {
    dispatch(fetchAvailableCities(api));
  }, []);
  useEffect(() => {
    if (availableCities) setSelectedCity(availableCities[0]);
  }, [availableCities]);
  // fetch available fleets for selected city
  useEffect(() => {
    if (selectedCity != null) dispatch(fetchApprovedFleets(api)(selectedCity.id));
  }, [selectedCity]);

  // handers
  const confirmFleet = useCallback(() => {
    // TODO: change fleet
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
              value={selectedCity?.name}
              style={{ marginTop: 16 }}
            />
            <DefaultButton
              style={{ marginTop: 8 }}
              title={t('Minha cidade não está disponível')}
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
              activityIndicator={busy}
            />
          </PaddedView>
        }
      />
    </View>
  );
}
