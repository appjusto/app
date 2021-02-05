import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Address, Place } from 'appjusto-types';
import debounce from 'lodash/debounce';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SectionList,
  SectionListData,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import useAxiosCancelToken from '../../../common/hooks/useAxiosCancelToken';
import useLastKnownLocation from '../../../common/hooks/useLastKnownLocation';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { colors, padding, screens, texts } from '../../../common/styles';
import { formatAddress } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { OrderNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OrderNavigatorParamList, 'AddressComplete'>;
type ScreenRouteProp = RouteProp<OrderNavigatorParamList, 'AddressComplete'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { value, returnScreen, returnParam } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const consumer = useSelector(getConsumer)!;
  // state
  const [isLoading, setLoading] = React.useState(false);
  const { coords } = useLastKnownLocation();
  const [autocompleteSession] = React.useState(nanoid());
  const [searchText, setSearchText] = React.useState(
    value?.address ? formatAddress(value?.address) : ''
  );
  const [additionalInfo, setAdditionalInfo] = React.useState(value?.additionalInfo ?? '');
  const [autocompletePredictions, setAutoCompletePredictions] = React.useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(null);
  const sections: SectionListData<Address>[] = React.useMemo(() => {
    let sections: SectionListData<Address>[] = [];
    sections = [
      ...sections,
      { title: t('Resultados da busca'), data: autocompletePredictions, key: 'search-results' },
    ];
    const addresses = (consumer.favoritePlaces ?? []).map((place) => place.address);
    sections = [
      ...sections,
      { title: t('Últimos endereços utilizados'), data: addresses, key: 'last-used-address' },
    ];
    return sections;
  }, [autocompletePredictions]);
  // helpers
  // using cancel token to allow canceling ongoing requests after unmounting
  const createCancelToken = useAxiosCancelToken();
  // debounced callback to avoid calling the maps API more often than necessary
  // TODO: what would be a better threshold than 500ms?
  const getAddress = React.useCallback(
    debounce<(input: string, session: string) => void>(async (input: string, session) => {
      setLoading(true);
      const results = await api
        .maps()
        .googlePlacesAutocomplete(input, session, createCancelToken(), coords);
      setLoading(false);
      if (results) setAutoCompletePredictions(results);
    }, 500),
    [coords]
  );
  // refs
  const searchInputRef = React.useRef<TextInput>();
  // side effects
  // auto focus on input
  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  // search for suggestions whenever user changes the input
  React.useEffect(() => {
    // what would be a better threshold than 1 character?
    if (searchText.length <= 1) {
      setAutoCompletePredictions([]);
      return;
    }
    // do not search after user selects from list
    if (selectedAddress && searchText === formatAddress(selectedAddress)) return;
    getAddress(searchText, autocompleteSession);
  }, [searchText, autocompleteSession]);
  // update search text when user selects a place from suggestion list
  React.useEffect(() => {
    if (selectedAddress) {
      setSearchText(formatAddress(selectedAddress));
    }
  }, [selectedAddress]);

  // handlers
  // fires whenever use change the input text
  const textChangeHandler = React.useCallback(
    (text) => {
      if (text === searchText) return; // avoid searching when user selects from suggestion list
      setSearchText(text); // update source text
      setSelectedAddress(null); // so we know text is freshier than what it was selected
    },
    [searchText]
  );
  // when user select item from list
  const selectItemHandler = React.useCallback((item: Address) => {
    Keyboard.dismiss();
    setAutoCompletePredictions([]); // clearing predictions hides the modal
    setSelectedAddress(item);
    const favoritePlace = consumer.favoritePlaces?.find(
      (p) => p.address.description === item.description
    );
    if (favoritePlace?.additionalInfo) setAdditionalInfo(favoritePlace.additionalInfo);
  }, []);

  // confirm button callback
  const completeHandler = React.useCallback(() => {
    if (!selectedAddress) return;
    // create a place object when user confirm without selecting from suggestion list
    const place: Place = { address: selectedAddress, additionalInfo };
    navigation.navigate(returnScreen, { [returnParam]: place });
  }, [navigation, returnScreen, selectedAddress, searchText, additionalInfo]);

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
      <DefaultInput
        defaultValue={additionalInfo}
        value={additionalInfo}
        title={t('Complemento (se houver)')}
        placeholder={t('Apartamento, sala, loja')}
        onChangeText={setAdditionalInfo}
        style={{ marginBottom: padding }}
        autoCorrect={false}
      />
      <SectionList
        stickySectionHeadersEnabled={false}
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.description}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => {
          if (section.key === 'search-results' && isLoading)
            return <ActivityIndicator size="small" color={colors.black} />;
          if (section.data.length > 0)
            return <Text style={{ ...texts.small, color: colors.darkGrey }}>{section.title}</Text>;
          return null;
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectItemHandler(item)}>
            <View
              style={{
                width: '100%',
                height: 61,
                justifyContent: 'center',
              }}
            >
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
        activityIndicator={isLoading}
        disabled={isLoading || !selectedAddress}
      />
    </PaddedView>
  );
}
