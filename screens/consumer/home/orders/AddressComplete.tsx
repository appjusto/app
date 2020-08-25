import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid/non-secure';
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';

import { getAddressAutocomplete } from '../../../../store/order/actions';
import { getPlacesFromPreviousOrders } from '../../../../store/order/selectors';
import { Place } from '../../../../store/order/types';
import { t } from '../../../../strings';
import { ApiContext } from '../../../app/context';
import DefaultButton from '../../../common/DefaultButton';
import DefaultInput from '../../../common/DefaultInput';
import { borders, texts, screens, colors } from '../../../common/styles';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'AddressComplete'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'AddressComplete'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const { value, returnScreen, returnParam } = route.params ?? {};

  // app state
  const placesFromPreviousOrders = useSelector(getPlacesFromPreviousOrders);

  // state
  const autocompleteSession = nanoid();
  const [searchText, setSearchText] = useState(value ?? '');
  const [autocompletePredictions, setAutoCompletePredictions] = useState<Place[]>(
    placesFromPreviousOrders
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // effects
  // update search text when user selects a place from suggestion list
  useEffect(() => {
    if (selectedPlace) {
      setSearchText(selectedPlace.address!);
    }
  }, [selectedPlace]);

  // handlers
  const getAddress = useCallback(
    debounce<(input: string) => void>(async (input: string): Promise<void> => {
      const results = await getAddressAutocomplete(api)(input, autocompleteSession);
      setAutoCompletePredictions(results);
    }, 300),
    [autocompleteSession]
  );

  // fires whenever use change the input text
  const textChangeHandler = useCallback(
    (text) => {
      if (text === searchText) return; // avoid searching when user selects from suggestion list
      setSearchText(text); // update source text
      setSelectedPlace(null); // so we know text is freshier than what it was selected
      // TODO: what would be a better threshold than 3 characteres?
      if (text.length > 3) {
        getAddress(text);
      }
    },
    [searchText]
  );

  // confirm button callback
  const completeHandler = useCallback(() => {
    // create a place object when user confirm without selecting from suggestion list
    const place = selectedPlace ?? { address: searchText };
    navigation.navigate(returnScreen, { [returnParam]: place });
  }, [navigation, returnScreen, selectedPlace, searchText]);

  // UI
  return (
    <View style={{ ...screens.lightGrey, paddingTop: 16 }}>
      <DefaultInput
        defaultValue={searchText}
        value={searchText}
        title={t('Endereço de retirada')}
        placeholder={t('Endereço com número')}
        onChangeText={textChangeHandler}
        style={{ marginBottom: 32 }}
      />
      <Text style={{ ...texts.small, color: colors.darkGrey, marginBottom: 14 }}>
        {t('Últimos endereços utilizados')}
      </Text>
      <FlatList
        style={{ flex: 1 }}
        data={autocompletePredictions}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setSelectedPlace(item);
              }}
            >
              <View style={styles.item}>
                <Text style={{ ...texts.medium }}>{item.address}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        // TODO: use google place id
        keyExtractor={(item) => item.googlePlaceId ?? item.address!}
      />
      <DefaultButton title={t('Confirmar endereço')} onPress={completeHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    height: 61,
    ...borders.default,
    justifyContent: 'center',
  },
});
