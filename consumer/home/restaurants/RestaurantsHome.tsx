import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Business, WithId } from 'appjusto-types';
import { nanoid } from 'nanoid/non-secure';
import React, { useContext } from 'react';
import { ActivityIndicator, SectionList, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import { HorizontalSelectItem } from '../../../common/components/buttons/HorizontalSelect';
import PaddedView from '../../../common/components/containers/PaddedView';
import useLastKnownLocation from '../../../common/hooks/useLastKnownLocation';
import { useBusinesses } from '../../../common/store/api/business/hooks/useBusinesses';
import { getReverseGeocodeAdress } from '../../../common/store/order/actions';
import { colors, halfPadding, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import CuisinesBox from './components/CuisinesBox';
import DoubleHeader from './components/DoubleHeader';
import FilterSelector from './components/FilterSelector';
import LocationBar from './components/LocationBar';
import RestaurantListItem from './components/RestaurantListItem';
import RestaurantSearchBar from './components/RestaurantSearchBar';
import * as fake from './fakeData';
import RestaurantsFeedback from './RestaurantsFeedback';
import { RestaurantsNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'RestaurantsHome'>;
type ScreenRouteProp = RouteProp<RestaurantsNavigatorParamList, 'RestaurantsHome'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  // params
  const { address, selectedFilter } = route.params ?? {};
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const openRestaurants = useBusinesses({ type: 'restaurant', status: 'open' });
  const closedRestaurants = useBusinesses({ type: 'restaurant', status: 'closed' });

  // state
  const [locationKey] = React.useState(nanoid());
  const { lastKnownLocation } = useLastKnownLocation(true, locationKey);
  const [addressDescription, setAddressDescription] = React.useState('');

  // data
  const data: HorizontalSelectItem[] = [
    { id: '0', title: t('Adicionados recentemente') },
    { id: '1', title: t('Menores preços') },
    { id: '3', title: t('Menor tempo de entrega') },
    { id: '5', title: t('Menor distância') },
  ];
  const [chosenFilter, setChosenFilter] = React.useState(
    data.find((d) => d.title === selectedFilter) ?? data[0]
  );

  //side-effects
  React.useEffect(() => {
    if (!lastKnownLocation) return;
    (async () => {
      const location = await dispatch(getReverseGeocodeAdress(api)(lastKnownLocation.coords));
      setAddressDescription(location);
    })();
  }, [lastKnownLocation]);
  // whenever address changes (from AddressComplete)
  React.useEffect(() => {
    if (address) {
      const formattedAddress = `${address?.main}, ${address?.state}, ${address?.country}`;
      setAddressDescription(formattedAddress);
    }
  }, [address]);
  // whenever the filter changes (from OrderBy)

  //UI

  if (!openRestaurants || !closedRestaurants || !lastKnownLocation) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  if (!openRestaurants && !closedRestaurants) {
    return <RestaurantsFeedback address={addressDescription} />;
  }

  type Sections = {
    title: string;
    subtitle: string;
    data: WithId<Business>[];
  };
  const sections: Sections[] = [
    {
      title: t('Restaurantes abertos agora'),
      subtitle: t('Valor justo para restaurantes e entregadores'),
      data: openRestaurants,
    },
    {
      title: t('Fechados no momento'),
      subtitle: t('Fora do horário de funcionamento'),
      data: closedRestaurants,
    },
  ];

  return (
    <SectionList
      style={{ ...screens.default }}
      ListHeaderComponent={
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate('AddressComplete', {
              value: addressDescription,
              returnParam: 'address',
              returnScreen: 'RestaurantsHome',
            });
          }}
        >
          <View>
            <LocationBar address={addressDescription} />
            {/* <DoubleHeader title="Os mais queridos" subtitle="Os lugares mais pedidos da sua região" /> */}
            {/* horizontal flatlist displaying the "most liked" restaurants here */}
            {/* <MostLikedItem /> */}
            <DoubleHeader title="Buscar" subtitle="Já sabe o que quer? Então não perde tempo!" />
            <View style={{ marginTop: 24, paddingHorizontal: 12, marginBottom: halfPadding }}>
              <RestaurantSearchBar navigation={navigation} />
            </View>
            <DoubleHeader title="Tá com fome de que?" subtitle="Escolha por categoria" />
            <PaddedView style={{ flexDirection: 'row', marginTop: halfPadding }}>
              {/* replace with a flatlist */}
              <CuisinesBox cuisine="Pizza" image={fake.pizza} />
              <CuisinesBox cuisine="Oriental" image={fake.oriental} />
              <CuisinesBox cuisine="Mexicano" image={fake.mexican} />
            </PaddedView>
            {/* "OrderBy" component  here*/}
            <View
              style={{
                marginHorizontal: 12,
                marginTop: padding,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {/* needs 'onSelectFilter' logic */}
              <FilterSelector
                onSelect={() => {}}
                onFilter={() => navigation.navigate('OrderBy')}
                data={data}
                selected={chosenFilter}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      }
      sections={sections}
      renderSectionHeader={({ section }) => (
        <DoubleHeader title={section.title} subtitle={section.subtitle} />
      )}
      keyExtractor={(item) => item.id!}
      stickySectionHeadersEnabled={false}
      renderItem={({ item }) => (
        <View style={{ marginTop: padding }}>
          <RestaurantListItem
            onPress={() => {
              navigation.push('RestaurantNavigator', {
                restaurantId: item.id,
              });
            }}
            name={item.name ?? 'Nome do restaurante'}
            cuisine={item.cuisine?.name ?? 'Tipo de comida'}
            deliveryRange={item.deliveryRange ?? 4}
          />
        </View>
      )}
    />
  );
}
