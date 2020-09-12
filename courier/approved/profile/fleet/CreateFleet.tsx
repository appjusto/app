import Slider from '@react-native-community/slider';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { slider } from '../../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import PaddedView from '../../../../common/components/views/PaddedView';
import { fetchAvailableCities } from '../../../../common/store/fleet/actions';
import { getAvailableCities } from '../../../../common/store/fleet/selectors';
import { City } from '../../../../common/store/fleet/types';
import { texts, screens, colors, borders, padding } from '../../../../common/styles';
import { t } from '../../../../strings';
import { FleetParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<FleetParamList, 'CreateFleet'>;
type ScreenRouteProp = RouteProp<FleetParamList, 'CreateFleet'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const availableCities = useSelector(getAvailableCities);

  // screen state
  const [selectedCity, setSelectedCity] = useState<City | undefined>(availableCities?.[0]);

  // effects
  // fetch available cities
  useEffect(() => {
    if (availableCities === undefined) dispatch(fetchAvailableCities(api));
  }, []);

  // state
  const [fare, setFare] = useState(0);
  const [farePerKm, setFarePerKm] = useState(0);
  //UI
  return (
    <ScrollView>
      <PaddedView style={{ ...screens.configScreen }}>
        <Text style={{ ...texts.default, marginTop: 8, color: colors.darkGrey }}>
          {t('Preencha as informações da sua frota')}
        </Text>
        <DefaultInput
          title={t('Cidades disponíveis')}
          placeholder={t('Pesquise sua cidade')}
          value={selectedCity?.name}
          style={{ marginTop: padding * 2 }}
        />
        <DefaultInput
          title={t('Nome da frota')}
          placeholder={t('Nome da frota')}
          style={{ marginTop: 32 }}
        />
        <DefaultInput
          title={t('Descrição')}
          placeholder={t('Descreva sua frota em até 140 caracteres')}
          style={{ marginTop: 12, height: 126 }}
        />
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 64 }}>
            <Text style={{ ...texts.medium }}>{t('Defina o valor mínimo da corrida: ')}</Text>
            <View style={styles.fareDisplay}>
              <Text style={{ ...texts.default }}>R$ {fare}</Text>
            </View>
          </View>
          <Slider
            style={{ width: '100%', height: 40, marginTop: 12 }}
            minimumValue={0}
            maximumValue={20}
            step={1}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            thumbImage={slider}
            value={fare}
            onValueChange={(fare) => setFare(fare)}
          />
          <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('min: R$ 0')}</Text>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('máx: R$ 20')}</Text>
          </View>
        </View>
        <View style={{ marginTop: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ ...texts.medium }}>{t('Defina o valor por km: ')}</Text>
            <View style={[styles.fareDisplay, { width: 112 }]}>
              <Text style={{ ...texts.default }}>R$ {farePerKm} por km</Text>
            </View>
          </View>
          <Slider
            style={{ width: '100%', height: 40, marginTop: 12 }}
            minimumValue={0}
            maximumValue={20}
            step={1}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            thumbImage={slider}
            value={farePerKm}
            onValueChange={(farePerKm) => setFarePerKm(farePerKm)}
          />
          <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' }}>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('min: R$ 0')}</Text>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('máx: R$ 10')}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <DefaultButton style={{ marginVertical: 32 }} title={t('Confirmar')} onPress={() => {}} />
      </PaddedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fareDisplay: {
    ...borders.default,
    borderRadius: 32,
    height: 32,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
