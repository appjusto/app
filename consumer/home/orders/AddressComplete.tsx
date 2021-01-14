import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Address, LatLng } from 'appjusto-types';
import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid/non-secure';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import useAxiosCancelToken from '../../../common/hooks/useAxiosCancelToken';
import useLastKnownLocation from '../../../common/hooks/useLastKnownLocation';
import { AutoCompleteResult } from '../../../common/store/api/maps';
import { getAddressAutocomplete } from '../../../common/store/order/actions';
import { getPlacesFromPreviousOrders } from '../../../common/store/order/selectors';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'AddressComplete'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'AddressComplete'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { value, returnScreen, returnParam } = route.params;
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // refs
  const searchInputRef = useRef<TextInput>();

  // app state
  const placesFromPreviousOrders = useSelector(getPlacesFromPreviousOrders);
  const busy = useSelector(getUIBusy);

  // state
  const [locationKey] = useState(nanoid());
  const { lastKnownLocation } = useLastKnownLocation(true, locationKey);
  const [autocompleteSession] = useState(nanoid());
  const [searchText, setSearchText] = useState(value ?? '');
  const [autocompletePredictions, setAutoCompletePredictions] = useState<AutoCompleteResult[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const sections: SectionListData<Address>[] = useMemo(() => {
    let sections: SectionListData<Address>[] = [];
    sections = [
      ...sections,
      { title: t('Resultados da busca'), data: autocompletePredictions, key: 'search-results' },
    ];
    const addresses = placesFromPreviousOrders.map((value) => value.address!);
    sections = [
      ...sections,
      { title: t('Últimos endereços utilizados'), data: addresses, key: 'last-used-address' },
    ];
    return sections;
  }, [placesFromPreviousOrders, autocompletePredictions]);
  // helpers
  // using cancel token to allow canceling ongoing requests after unmounting
  const createCancelToken = useAxiosCancelToken();
  // debounced callback to avoid calling the maps API more often than necessary
  // TODO: what would be a better threshold than 500ms?
  const getAddress = useCallback(
    debounce<(input: string, session: string) => void>(async (input: string, session) => {
      const coords: LatLng | undefined = lastKnownLocation
        ? {
            latitude: lastKnownLocation.coords.latitude,
            longitude: lastKnownLocation.coords.longitude,
          }
        : undefined;
      const results = await dispatch(
        getAddressAutocomplete(api)(input, session, createCancelToken(), coords)
      );
      if (results) setAutoCompletePredictions(results);
    }, 500),
    [lastKnownLocation]
  );

  // effects
  // auto focus on input
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  // search for suggestions whenever user changes the input
  useEffect(() => {
    // TODO: what would be a better threshold than 3 characteres?
    if (searchText.length <= 3) {
      setAutoCompletePredictions([]);
      return;
    }
    // do not search after user selects from list
    if (selectedAddress?.description === searchText) return;
    getAddress(searchText, autocompleteSession);
  }, [searchText, autocompleteSession]);
  // update search text when user selects a place from suggestion list
  useEffect(() => {
    if (selectedAddress) {
      setSearchText(selectedAddress.description ?? '');
    }
  }, [selectedAddress]);

  // handlers
  // fires whenever use change the input text
  const textChangeHandler = useCallback(
    (text) => {
      if (text === searchText) return; // avoid searching when user selects from suggestion list
      setSearchText(text); // update source text
      setSelectedAddress(null); // so we know text is freshier than what it was selected
    },
    [searchText]
  );
  // when user select item from list
  const selectItemHandler = useCallback((item: Address) => {
    Keyboard.dismiss();
    setSelectedAddress(item);
    setAutoCompletePredictions([]); // clearing predictions hides the modal
  }, []);

  // confirm button callback
  const completeHandler = useCallback(() => {
    // create a place object when user confirm without selecting from suggestion list
    const address = selectedAddress ?? { address: searchText };
    navigation.navigate(returnScreen, { [returnParam]: address });
  }, [navigation, returnScreen, selectedAddress, searchText]);

  // UI
  return (
    <PaddedView style={{ ...screens.config }}>
      <DefaultInput
        ref={searchInputRef}
        defaultValue={searchText}
        value={searchText}
        title={t('Endereço com número')}
        placeholder={t('Ex: Av. Paulista 1578')}
        onChangeText={textChangeHandler}
        style={{ marginBottom: padding }}
        autoCorrect={false}
      />
      <SectionList
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.description}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => {
          if (section.key === 'search-results' && busy)
            return <ActivityIndicator size="small" color={colors.black} />;
          if (section.data.length > 0)
            return <Text style={{ ...texts.small, color: colors.darkGrey }}>{section.title}</Text>;
          return null;
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectItemHandler(item)}>
            <View style={styles.item}>
              <Text style={{ ...texts.medium }}>{item.main}</Text>
              <Text style={{ ...texts.small }}>{item.secondary}</Text>
            </View>
          </TouchableOpacity>
        )}
        SectionSeparatorComponent={() => <View style={{ height: padding }} />}
      />
      <DefaultButton
        title={t('Confirmar endereço')}
        onPress={completeHandler}
        activityIndicator={busy}
        disabled={busy}
      />
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    height: 61,
    justifyContent: 'center',
  },
});
