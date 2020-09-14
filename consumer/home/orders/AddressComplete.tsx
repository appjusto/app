import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Place } from 'appjusto-types';
import { isEmpty } from 'lodash';
import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid/non-secure';
import React, { useState, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  SectionList,
  SectionListData,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import PaddedView from '../../../common/components/views/PaddedView';
import useAxiosCancelToken from '../../../common/hooks/useAxiosCancelToken';
import { AutoCompleteResult } from '../../../common/store/api/maps';
import { getAddressAutocomplete } from '../../../common/store/order/actions';
import { getPlacesFromPreviousOrders } from '../../../common/store/order/selectors';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { texts, screens, colors, padding } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';

function isPlace(item: Place | AutoCompleteResult): item is Place {
  return (item as Place).address !== undefined;
}

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'AddressComplete'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'AddressComplete'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { value, returnScreen, returnParam } = route.params ?? {};

  // refs
  const searchInputRef = useRef<TextInput>();

  // app state
  const placesFromPreviousOrders = useSelector(getPlacesFromPreviousOrders);
  const busy = useSelector(getUIBusy);

  // state
  const [autocompleteSession] = useState(nanoid());
  const [searchText, setSearchText] = useState(value ?? '');
  const [autocompletePredictions, setAutoCompletePredictions] = useState<AutoCompleteResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const sections: SectionListData<Place | AutoCompleteResult>[] = useMemo(() => {
    let sections: SectionListData<Place | AutoCompleteResult>[] = [];
    if (!isEmpty(autocompletePredictions)) {
      sections = [...sections, { title: t('Resultados da busca'), data: autocompletePredictions }];
    }
    if (!isEmpty(placesFromPreviousOrders)) {
      sections = [
        ...sections,
        { title: t('Últimos endereços utilizados'), data: placesFromPreviousOrders },
      ];
    }
    return sections;
  }, [placesFromPreviousOrders, autocompletePredictions]);
  // helpers
  // using cancel token to allow canceling ongoing requests after unmounting
  const cancelToken = useAxiosCancelToken();
  // debounced callback to avoid calling the maps API more often than necessary
  // TODO: what would be a better threshold than 500ms?
  const getAddress = useCallback(
    debounce<(input: string, session: string) => void>(async (input: string, session) => {
      console.log('searching', input);
      const results = await dispatch(getAddressAutocomplete(api)(input, session, cancelToken));
      if (results) setAutoCompletePredictions(results);
    }, 500),
    []
  );

  // effects
  // auto focus on input
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  // search for suggestions whenever user changes the input
  useEffect(() => {
    // TODO: what would be a better threshold than 3 characteres?
    if (searchText.length <= 3) return;
    // do not search after user selects from list
    if (selectedPlace?.address === searchText) return;
    getAddress(searchText, autocompleteSession);
  }, [searchText, autocompleteSession]);
  // update search text when user selects a place from suggestion list
  useEffect(() => {
    if (selectedPlace) {
      setSearchText(selectedPlace.address!);
    }
  }, [selectedPlace]);

  // handlers
  // fires whenever use change the input text
  const textChangeHandler = useCallback(
    (text) => {
      if (text === searchText) return; // avoid searching when user selects from suggestion list
      setSearchText(text); // update source text
      setSelectedPlace(null); // so we know text is freshier than what it was selected
    },
    [searchText]
  );
  // when user select item from list
  const selectPlaceHandler = useCallback((place: Place) => {
    Keyboard.dismiss();
    setSelectedPlace(place);
    setAutoCompletePredictions([]); // clearing predictions hides the modal
  }, []);

  // confirm button callback
  const completeHandler = useCallback(() => {
    // create a place object when user confirm without selecting from suggestion list
    const place = selectedPlace ?? { address: searchText };
    navigation.navigate(returnScreen, { [returnParam]: place });
  }, [navigation, returnScreen, selectedPlace, searchText]);

  // UI
  return (
    <PaddedView style={{ ...screens.configScreen }}>
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
        keyExtractor={(item) => {
          if (isPlace(item)) return item.googlePlaceId ?? item.address!;
          return item.placeId ?? item.description!;
        }}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => (
          <Text style={{ ...texts.small, color: colors.darkGrey }}>{section.title}</Text>
        )}
        renderItem={({ item }) => {
          if (isPlace(item)) {
            return (
              <TouchableOpacity onPress={() => selectPlaceHandler(item)}>
                <View style={styles.item}>
                  <Text style={{ ...texts.medium }}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity onPress={() => selectPlaceHandler({ address: item.instructions })}>
                <View style={styles.item}>
                  <Text style={{ ...texts.medium }}>{item.main}</Text>
                  <Text style={{ ...texts.small }}>{item.secondary}</Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
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
