import { useNavigation, useRoute } from '@react-navigation/native';
import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid/non-secure';
import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';

import { getEnv } from '../../store/config/selectors';
import { t } from '../../strings';
import { ApiContext } from '../app/context';
import DefaultButton from './DefaultButton';
import DefaultInput from './DefaultInput';
import Touchable from './Touchable';
import { borders, texts, screens, colors } from './styles';

export default function () {
  // context
  const api = useContext(ApiContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { params } = route;
  const { value: initialAddress, destinationScreen, destinationParam } = params;

  // state
  const dev = useSelector(getEnv) === 'development';
  const autocompleteSession = nanoid();
  const [address, setAddress] = useState(initialAddress);
  const [autocompletePredictions, setAutoCompletePredictions] = useState(
    dev
      ? [
          {
            description: 'Av. Paulista, 1578',
          },
          {
            description: 'Av. Paulista, 2424',
          },
          {
            description: 'Largo de São Bento',
          },
        ]
      : []
  );

  // handlers
  const getAddress = useCallback(
    debounce<(input: string) => void>(async (input: string): Promise<void> => {
      const { predictions } = await api.googlePlacesAutocomplete(input, autocompleteSession);
      setAutoCompletePredictions(predictions);
    }, 1000),
    [autocompleteSession]
  );

  const textChangeHandler = useCallback(
    (text) => {
      setAddress(text);
      if (text.length > 5) {
        // TODO: define threshold
        getAddress(address);
      }
    },
    [address]
  );

  const completeHandler = useCallback(() => {
    navigation.navigate(destinationScreen, { [destinationParam]: address });
  }, [navigation, destinationScreen, address]);

  // UI
  return (
    <View style={{ ...screens.lightGrey, paddingTop: 16 }}>
      <DefaultInput
        defaultValue={initialAddress}
        value={address}
        title={t('Endereço de retirada')}
        placeholder={t('Endereço com número')}
        onChangeText={textChangeHandler}
        style={{ marginBottom: 32 }}
      />
      <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: 14 }}>
        {t('Últimos endereços utilizados')}
      </Text>
      <FlatList
        data={autocompletePredictions}
        renderItem={({ item }) => {
          return (
            <Touchable onPress={() => setAddress(item.description)}>
              <View style={style.item}>
                <Text style={{ ...texts.medium }}>{item.description}</Text>
              </View>
            </Touchable>
          );
        }}
        keyExtractor={(item) => item.description}
      />
      <DefaultButton
        styleObject={{ marginBottom: 16 }}
        title={t('Confirmar endereço')}
        onPress={completeHandler}
      />
    </View>
  );
}

const style = StyleSheet.create({
  item: {
    width: '100%',
    height: 61,
    ...borders.default,
    justifyContent: 'center',
  },
});
