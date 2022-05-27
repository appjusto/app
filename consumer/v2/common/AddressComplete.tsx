import { Address, Place } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import useLastKnownLocation from '../../../common/location/useLastKnownLocation';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getConsumer } from '../../../common/store/consumer/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatAddress } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { FoodOrderNavigatorParamList } from '../food/types';
import { P2POrderNavigatorParamList } from '../p2p/types';

export type AddressCompleteParamList = {
  AddressComplete: {
    returnScreen: 'CreateOrderP2P' | 'FoodOrderHome' | 'RecommendRestaurant';
    returnParam: string;
    value?: Place;
  };
};

type ScreenNavigationProp = StackNavigationProp<
  P2POrderNavigatorParamList & FoodOrderNavigatorParamList,
  'AddressComplete'
>;
type ScreenRouteProp = RouteProp<AddressCompleteParamList, 'AddressComplete'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const AddressComplete = ({ navigation, route }: Props) => {
  // params
  const { value, returnScreen, returnParam } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const consumer = useSelector(getConsumer);
  const dispatch = useDispatch<AppDispatch>();
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
  const [complement, setComplement] = React.useState(true);
  const sections: SectionListData<Address>[] = React.useMemo(() => {
    let sections: SectionListData<Address>[] = [];
    sections = [
      ...sections,
      { title: t('Resultados da busca'), data: autocompletePredictions, key: 'search-results' },
    ];
    const addresses = (consumer?.favoritePlaces ?? []).map((place) => place.address);
    sections =
      returnScreen !== 'RecommendRestaurant'
        ? [
            ...sections,
            { title: t('Últimos endereços utilizados'), data: addresses, key: 'last-used-address' },
          ]
        : [...sections];
    return sections;
  }, [autocompletePredictions, consumer?.favoritePlaces, returnScreen]);
  // helpers
  // debounced callback to avoid calling the maps API more often than necessary
  // TODO: what would be a better threshold than 500ms?
  const getAddress = React.useCallback(
    debounce<(input: string, session: string) => void>(async (input: string, session) => {
      setLoading(true);
      const results = await api.maps().googlePlacesAutocomplete(input, session, coords);
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
    if (selectedAddress) return;
    getAddress(searchText, autocompleteSession);
  }, [searchText, autocompleteSession, selectedAddress, getAddress]);
  // update search text when user selects a place from suggestion list
  React.useEffect(() => {
    if (selectedAddress) {
      setSearchText(formatAddress(selectedAddress));
    }
  }, [selectedAddress]);
  // change title in the page
  React.useEffect(() => {
    navigation.setOptions({
      title: returnScreen !== 'RecommendRestaurant' ? 'Confirmar endereço' : 'Indicar restaurante',
    });
  }, [navigation, returnScreen]);
  // tracking
  useSegmentScreen('AddressComplete');
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
  const selectItemHandler = React.useCallback(
    (item: Address) => {
      //when the user is selecting an address
      if (returnScreen !== 'RecommendRestaurant') {
        //if user enters only postal code, retrieves the address information
        const enteredPostalCode = /^[0-9]{5}-[0-9]{3}$/;
        if (enteredPostalCode.test(item.main === undefined ? '' : item?.main)) {
          item.main = item.secondary?.split(' - ').shift() + ', ';
          item.secondary = item.secondary?.split(' - ').join(' - ');
        } else {
          //number regex
          const entersNumber = /^.*[0-9]+.*$/;
          //verifies if the selected address has a number and dismisses keyboard
          if (entersNumber.test(item.main === undefined ? '' : item?.main)) Keyboard.dismiss();
          else {
            item.main = item.main?.split(' - ').shift() + ', ';
          }
        }
      } else Keyboard.dismiss();
      setAutoCompletePredictions([]); // clearing predictions hides the modal
      setSelectedAddress(item);
      const favoritePlace = consumer?.favoritePlaces?.find(
        (p) => p.address.description === item.description
      );
      if (favoritePlace?.additionalInfo) setAdditionalInfo(favoritePlace.additionalInfo);
    },
    [consumer?.favoritePlaces, returnScreen]
  );

  // confirm button callback
  const completeHandler = React.useCallback(() => {
    if (!selectedAddress) return;
    if (complement && !additionalInfo.length) {
      dispatch(
        showToast(
          t('Insira o complemento ou selecione a opção "Endereço sem complemento" para prosseguir'),
          'error'
        )
      );
      return;
    }
    // create a place object when user confirm without selecting from suggestion list
    const place: Place =
      returnScreen !== 'RecommendRestaurant'
        ? { address: selectedAddress, additionalInfo }
        : { address: selectedAddress };
    navigation.navigate(returnScreen, { [returnParam]: place });
  }, [
    selectedAddress,
    additionalInfo,
    navigation,
    returnScreen,
    returnParam,
    complement,
    dispatch,
  ]);
  // UI
  return (
    <PaddedView style={{ ...screens.config }}>
      <DefaultInput
        ref={searchInputRef}
        defaultValue={searchText}
        value={searchText}
        title={
          returnScreen !== 'RecommendRestaurant'
            ? t('Endereço com número')
            : t('Nome do restaurante')
        }
        placeholder={
          returnScreen !== 'RecommendRestaurant'
            ? t('Ex: Av. Paulista, 1578')
            : t('Qual restaurante você quer indicar?')
        }
        onChangeText={textChangeHandler}
        style={{ marginBottom: padding }}
        autoCorrect={false}
      />
      {returnScreen !== 'RecommendRestaurant' ? (
        <DefaultInput
          defaultValue={additionalInfo}
          value={additionalInfo}
          title={t('Complemento (se houver)')}
          placeholder={t('Apartamento, sala, loja')}
          onChangeText={setAdditionalInfo}
          style={{ marginBottom: padding }}
          autoCorrect={false}
          editable={complement}
        />
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
        <RadioButton
          title={t('Endereço sem complemento')}
          onPress={() => setComplement(!complement)}
          checked={!complement}
          variant="square"
        />
      </View>
      <SectionList
        stickySectionHeadersEnabled={false}
        style={{ flex: 1 }}
        sections={sections}
        keyExtractor={(item) => item.googlePlaceId ?? `${item.main} ${item.secondary}`}
        keyboardShouldPersistTaps="handled"
        renderSectionHeader={({ section }) => {
          if (section.key === 'search-results' && isLoading)
            return <ActivityIndicator size="small" color={colors.black} />;
          if (section.data.length > 0) {
            if (returnScreen !== 'RecommendRestaurant')
              return <Text style={{ ...texts.xs, color: colors.grey700 }}>{section.title}</Text>;
          }
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
              <Text style={{ ...texts.md }}>{item.main}</Text>
              <Text style={{ ...texts.xs }}>{item.secondary}</Text>
            </View>
          </TouchableOpacity>
        )}
        SectionSeparatorComponent={() => <View style={{ height: padding }} />}
      />
      <View>
        <DefaultButton
          title={
            returnScreen !== 'RecommendRestaurant'
              ? t('Confirmar endereço')
              : t('Indicar restaurante')
          }
          onPress={completeHandler}
          activityIndicator={isLoading}
          disabled={isLoading || !selectedAddress}
        />
      </View>
    </PaddedView>
  );
};
