import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { nanoid } from 'nanoid/non-secure';
import debounce from 'lodash/debounce';

import { ApiContext } from '../../store/api';

import DefaultInput from './DefaultInput';
import { t } from '../../strings';
import { borders } from './styles';
import Touchable from './Touchable';
import { useSelector } from 'react-redux';
import { getEnv } from '../../store/selectors/config';

export default function ({ navigation, route }) {
  // context
  const api = useContext(ApiContext);
  const { params } = route;
  const { field, destinationScreen } = params;
  const initialAddress = params[field];

  // state
  const dev = useSelector(getEnv) === 'development';
  const autocompleteSession = nanoid();
  const [address, setAddress] = useState(initialAddress);
  const [autocompletePredictions, setAutoCompletePredictions] = useState( dev ? [{
    description: 'Av. Paulista, 1578'
  }, {
    description: 'Av. Paulista, 2424'
  }] : []);

  // handlers
  const getAddress = useCallback(debounce(async (input) => {
    const { predictions } = await api.getAddressAutocomplete(input, autocompleteSession);
    console.log(predictions)
    setAutoCompletePredictions(predictions);
  }, 1000), []);

  const textChangeHandler = (text) => {
    setAddress(text);

    if (text.length > 5) { // TODO: define threshold
      getAddress(address, autocompleteSession);
    }
  }

  // UI
  return (
    <View style={{ flex: 1 }}>
      <DefaultInput
        value={address}
        title={t('Endereço de retirada')}
        placeholder={t('Endereço com número')}
        onChangeText={textChangeHandler}
      />
      <FlatList
        data={autocompletePredictions}
        renderItem={({ item }) => {
          return (
            <Touchable
              onPress={() => setAddress(item.description) }>
              <View style={style.item}>
                <Text>{item.description}</Text>
              </View>
            </Touchable>
          )
        }}
        keyExtractor={(item) => item.description}
      />
      <Button
        title={t('Pronto')}
        onPress={() => navigation.navigate(destinationScreen, { field, [field]: address }) }
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
  }
})
