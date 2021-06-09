import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { t } from '../../../../strings';
import DefaultButton from '../../../components/buttons/DefaultButton';
import DefaultInput from '../../../components/inputs/DefaultInput';
import {
  fetchBrazilianCitiesByState,
  fetchBrazilianStates,
  IBGECity,
  IBGEState,
} from '../../../store/api/externals/ibge';
import { padding, screens, texts } from '../../../styles';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'SelectLocation'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'SelectLocation'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const SelectLocation = ({ navigation, route }: Props) => {
  const [states, setStates] = React.useState<IBGEState[]>();
  const [cities, setCities] = React.useState<IBGECity[]>();
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [mode, setMode] = React.useState<'states' | 'cities'>('states');
  // effects
  // navigation params
  React.useEffect(() => {
    if (route.params.state) {
      navigation.setParams({ state: undefined });
      setState(route.params.state);
    }
    if (route.params.city) {
      navigation.setParams({ city: undefined });
      setCity(route.params.city);
    }
  }, [navigation, route.params]);
  // state
  React.useEffect(() => {
    if (states === undefined) {
      (async () => {
        setStates(await fetchBrazilianStates());
      })();
    }
  }, [states]);
  React.useEffect(() => {
    if (state.length === 2) {
      (async () => {
        setCities(await fetchBrazilianCitiesByState(state));
      })();
    }
  }, [state]);

  // UI
  return (
    <View style={{ ...screens.lightGrey, paddingTop: padding }}>
      <DefaultInput
        title={t('Estado')}
        placeholder={t('Digite seu estado')}
        style={{ marginBottom: padding }}
        value={state}
        onChangeText={setState}
      />
      <DefaultInput
        title={t('Cidade')}
        placeholder={t('Digite sua cidade')}
        style={{ marginBottom: padding }}
        editable={state.length >= 2}
      />
      {mode === 'states' ? (
        <View>
          <FlatList
            data={states}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      height: 60,
                    }}
                  >
                    <Text style={{ ...texts.md }}>{item.sigla}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.sigla}
          />
        </View>
      ) : (
        <></>
      )}
      {/* <View style={{ flex: 1 }} /> */}
      <View>
        <DefaultButton title={t('Confirmar localização')} style={{ marginBottom: padding }} />
      </View>
    </View>
  );
};
