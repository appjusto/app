import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { t } from '../../../../strings';
import DefaultInput from '../../../components/inputs/DefaultInput';
import {
  fetchBrazilianCitiesByState,
  fetchBrazilianStates,
  IBGECity,
  IBGEState,
} from '../../../store/api/externals/ibge';
import { useSegmentScreen } from '../../../store/api/track';
import { padding, screens, texts } from '../../../styles';
import { removeAccents } from '../../../utils/formatters';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'SelectLocation'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'SelectLocation'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const SelectLocation = ({ navigation, route }: Props) => {
  const [states, setStates] = React.useState<IBGEState[]>([]);
  const [cities, setCities] = React.useState<IBGECity[]>([]);
  const [cityName, setCityName] = React.useState('');
  const filteredCities = React.useMemo(() => {
    if (!cities) return [];
    return cities.filter(
      (city) => removeAccents(city.nome).indexOf(removeAccents(cityName)) !== -1
    );
  }, [cities, cityName]);
  // effects
  // navigation params
  React.useEffect(() => {
    (async () => {
      if (route.params.mode === 'states') {
        setStates(await fetchBrazilianStates());
      } else if (route.params.mode === 'cities') {
        setCities(await fetchBrazilianCitiesByState(route.params.state));
      }
    })();
  }, [navigation, route.params]);
  // tracking
  useSegmentScreen('SelectLocation');
  // UI
  return (
    <View style={{ ...screens.lightGrey, paddingTop: padding }}>
      {route.params.mode === 'states' ? (
        <>
          {/* states */}
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={states}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ConsumerOnboarding', { state: item.sigla });
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      height: 60,
                    }}
                  >
                    <Text style={{ ...texts.md }}>{item.nome}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.sigla}
          />
        </>
      ) : (
        <>
          {/* cities */}
          <DefaultInput
            title={t('Cidade')}
            placeholder={t('Digite a cidade')}
            style={{ marginBottom: padding }}
            value={cityName}
            onChangeText={setCityName}
          />
          <FlatList
            data={filteredCities}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ConsumerOnboarding', { city: item.nome });
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      height: 60,
                    }}
                  >
                    <Text style={{ ...texts.md }}>{item.nome}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.nome}
          />
        </>
      )}
    </View>
  );
};
