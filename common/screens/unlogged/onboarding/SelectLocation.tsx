import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { t } from '../../../../strings';
import DefaultInput from '../../../components/inputs/DefaultInput';
import {
  fetchBrazilianCitiesByState,
  fetchBrazilianStates,
  IBGECity,
  IBGEState,
} from '../../../store/api/externals/ibge';
import { padding, screens } from '../../../styles';

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
    <SafeAreaView style={{ ...screens.lightGrey }}>
      <View>
        <DefaultInput
          title={t('Estado')}
          placeholder={t('Digite seu estado')}
          style={{ marginBottom: padding }}
        ></DefaultInput>
        <DefaultInput
          title={t('Cidade')}
          placeholder={t('Digite sua cidade')}
          style={{ marginBottom: padding }}
        ></DefaultInput>
        {mode === 'states' ? <></> : <></>}
      </View>
    </SafeAreaView>
  );
};
