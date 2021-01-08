import { StackNavigationProp } from '@react-navigation/stack';
import { Business, WithId } from 'appjusto-types';
import { nanoid } from 'nanoid/non-secure';
import React, { useContext } from 'react';
import { ActivityIndicator, Image, Text, TouchableWithoutFeedback, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import * as icons from '../assets/icons';
import { ApiContext, AppDispatch } from '../common/app/context';
import PaddedView from '../common/components/containers/PaddedView';
import useLastKnownLocation from '../common/hooks/useLastKnownLocation';
import { getReverseGeocodeAdress } from '../common/store/order/actions';
import { borders, colors, halfPadding, padding, screens, texts } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';
import CuisinesBox from './components/CuisinesBox';
import DoubleHeader from './components/DoubleHeader';
import LocationBar from './components/LocationBar';
import OrderInput from './components/OrderInput';
import RestaurantListItem from './components/RestaurantListItem';
import * as fake from './fakeData';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const { data: openRestaurants } = useQuery<WithId<Business>[], Error>('open-restaurants', () =>
    api.business().fetchBusinesses('open')
  );
  const { data: closedRestaurants } = useQuery<WithId<Business>[], Error>(
    'closed-restaurants',
    () => api.business().fetchBusinesses('closed')
  );

  // state
  const [locationKey] = React.useState(nanoid());
  const { lastKnownLocation } = useLastKnownLocation(true, locationKey);
  const [address, setAddress] = React.useState('');

  React.useEffect(() => {
    if (!lastKnownLocation) return;
    (async () => {
      const location = await dispatch(getReverseGeocodeAdress(api)(lastKnownLocation.coords));
      setAddress(location);
    })();
  }, [lastKnownLocation]);

  //UI
  const RestaurantSearch = () => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('RestaurantSearch')}
      style={{ marginHorizontal: 12 }}
    >
      <View
        style={{
          height: 60,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...borders.default,
          borderColor: colors.black,
          paddingHorizontal: 12,
        }}
      >
        <Text style={{ ...texts.default, color: colors.darkGrey }}>
          {t('Encontre um prato ou restaurante')}
        </Text>
        <Image source={icons.search} />
      </View>
    </TouchableWithoutFeedback>
  );

  // if (!openRestaurants || !closedRestaurants)
  //   return (
  //     <FeedbackView
  //       header={t('Sem restaurantes na sua região')}
  //       description={t(
  //         'Infelizmente não encontramos nenhum restaurante cadastrado no app próximo a você. Estamos começando, mas não se preocupe: em breve seu restaurante preferido estará aqui.'
  //       )}
  //       icon={icons.iconSad}
  //     >
  //       <HomeShareCard />
  //     </FeedbackView>
  //   );

  if (!openRestaurants || !closedRestaurants || !lastKnownLocation)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );

  return (
    <FlatList
      style={{ ...screens.default }}
      ListHeaderComponent={
        <View>
          <LocationBar address={address} />
          {/* <DoubleHeader title="Os mais queridos" subtitle="Os lugares mais pedidos da sua região" /> */}
          {/* vertical flatlist displaying the "most liked" restaurants here */}
          {/* <MostLikedItem /> */}
          <DoubleHeader title="Buscar" subtitle="Já sabe o que quer? Então não perde tempo!" />
          <View style={{ marginTop: 24, paddingHorizontal: 12 }}>
            <RestaurantSearch />
          </View>
          <DoubleHeader title="Tá com fome de que?" subtitle="Escolha por categoria" />
          <PaddedView style={{ flexDirection: 'row', marginTop: halfPadding }}>
            {/* replace with a flatlist */}
            <CuisinesBox cuisine="Pizza" image={fake.pizza} />
            <CuisinesBox cuisine="Oriental" image={fake.oriental} />
            <CuisinesBox cuisine="Mexicano" image={fake.mexican} />
          </PaddedView>
          <DoubleHeader
            title="Restaurantes abertos agora"
            subtitle="Valor justo para restaurantes e entregadores"
          />
          {/* "OrderBy" component  here*/}
          <OrderInput navigation={navigation} />
        </View>
      }
      data={openRestaurants}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => (
        <View style={{ marginTop: padding }}>
          <RestaurantListItem
            onPress={() => {
              navigation.navigate('RestaurantDetail', {
                restaurantId: item.id,
              });
            }}
            name={item.name ?? ''}
          />
        </View>
      )}
      ListFooterComponent={
        <View style={{ marginTop: 24 }}>
          <DoubleHeader title="Fechados no momento" subtitle="Fora do horário de funcionamento" />
          <RestaurantListItem onPress={() => null} name="Restaurante Fechado" />
          <RestaurantListItem onPress={() => null} name="Restaurante Fechado" />
          <RestaurantListItem onPress={() => null} name="Restaurante Fechado" />
          <RestaurantListItem onPress={() => null} name="Restaurante Fechado" />
        </View>
      }
    />
  );
}
