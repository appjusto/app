import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../assets/icons';
import { ApiContext, AppDispatch } from '../common/app/context';
import PaddedView from '../common/components/containers/PaddedView';
import RoundedText from '../common/components/texts/RoundedText';
import ArrowBox from '../common/components/views/ArrowBox';
import Pill from '../common/components/views/Pill';
import useTallerDevice from '../common/hooks/useTallerDevice';
import { getUser } from '../common/store/user/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../common/utils/formatters';
import { HomeNavigatorParamList } from '../consumer/home/types';
import { t } from '../strings';
import * as fake from './fakeData';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const tallerDevice = useTallerDevice();

  // app state
  const user = useSelector(getUser)!;
  // const getOpenRestaurants = (key: string) => api.menu().getOpenRestaurants();
  const getOpenRestaurants = (key: string) => api.menu().getOpenRestaurants();
  const { data: openRestaurants } = useQuery('open-restaurants', getOpenRestaurants);
  const getClosedRestaurants = (key: string) => api.menu().getClosedRestaurants();
  const { data: closedRestaurants } = useQuery('closed-restaurants', getClosedRestaurants);

  //UI
  //maybe we're going to put the components below in separate files
  const DoubleHeader = ({ title, subtitle, ...props }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, flex: 1 }} {...props}>
      <Pill tall />
      <View style={{ marginLeft: 12 }}>
        <Text style={{ ...texts.mediumToBig, color: colors.black }}>{t(title)}</Text>
        <Text style={{ ...texts.small, color: colors.darkGrey }}>{t(subtitle)}</Text>
      </View>
    </View>
  );

  const CuisinesBox = ({ cuisine, image }) => (
    <TouchableOpacity onPress={() => null}>
      <View style={{ height: 96, width: 96, borderRadius: 8, marginRight: halfPadding }}>
        <Image source={image} />
        <View style={{ position: 'absolute', left: 4, bottom: 4 }}>
          <RoundedText>{t(cuisine)}</RoundedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RestaurantListItem = ({ onPress, name }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={{ marginTop: halfPadding }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderStyle: 'solid',
            width: '100%',
            borderColor: colors.grey,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: padding,
            marginTop: halfPadding,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ marginTop: 12 }}>
            <Text style={{ ...texts.default }}>{name}</Text>
            {/* hardcoded infos below for now */}
            <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {separateWithDot(formatDistance(2000), formatDuration(1800))}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Image source={fake.restLogo} height={64} width={64} />
            <Image source={fake.burger} height={80} width={64} style={{ borderRadius: 8 }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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

  const LocationBar = () => (
    <TouchableWithoutFeedback
      onPress={() => null}
      style={{ marginTop: padding, marginHorizontal: 12 }}
    >
      <View
        style={{
          ...borders.default,
          backgroundColor: colors.lightGrey,
          width: '100%',
          height: 42,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          borderRadius: 32,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={icons.navigationArrow} />
          <Text style={{ ...texts.small, marginLeft: halfPadding }}>
            {t('Avenida Paulista, 1000, São Paulo, SP')}
          </Text>
        </View>
        <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Trocar')}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  const MostLikedItem = () => (
    <TouchableOpacity onPress={() => null}>
      <View style={{ marginTop: padding, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
          <Image source={fake.whiteSquare} style={{ height: 40, width: 40, borderRadius: 8 }} />
          <View style={{ marginLeft: halfPadding }}>
            <Text style={{ ...texts.medium }}>{t('Nome do restaurante')}</Text>
            <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
          </View>
        </View>
        <Image source={fake.likedImage} style={{ height: 120, width: 304, borderRadius: 8 }} />
      </View>
    </TouchableOpacity>
  );

  const OrderInput = () => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('OrderBy')}
      style={{ marginHorizontal: 12, marginTop: padding }}
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
        <Text style={{ ...texts.small, ...texts.bold }}>
          {t('Ordenar por: ')}
          <Text style={{ ...texts.small }}>{t('Adicionados recentemente')}</Text>
        </Text>
        <ArrowBox />
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <FlatList
      style={{ ...screens.default }}
      ListHeaderComponent={
        <View>
          <LocationBar />
          <DoubleHeader title="Os mais queridos" subtitle="Os lugares mais pedidos da sua região" />
          {/* vertical flatlist displaying the "most liked" restaurants here */}
          <MostLikedItem />
          <DoubleHeader title="Buscar" subtitle="Já sabe o que quer? Então não perde tempo!" />
          <View style={{ marginTop: 24 }}>
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
          <OrderInput />
        </View>
      }
      data={openRestaurants}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => (
        <View style={{ marginTop: padding }}>
          <RestaurantListItem
            onPress={() => navigation.navigate('RestaurantDetail')}
            name={item.name}
          />
        </View>
      )}
      ListFooterComponent={
        <View style={{ marginTop: 24 }}>
          <DoubleHeader title="Fechados no momento" subtitle="Fora do horário de funcionamento" />
          <RestaurantListItem
            onPress={() => navigation.navigate('RestaurantDetail')}
            name="Restaurante Fechado"
          />
          <RestaurantListItem
            onPress={() => navigation.navigate('RestaurantDetail')}
            name="Restaurante Fechado"
          />
          <RestaurantListItem
            onPress={() => navigation.navigate('RestaurantDetail')}
            name="Restaurante Fechado"
          />
          <RestaurantListItem
            onPress={() => navigation.navigate('RestaurantDetail')}
            name="Restaurante Fechado"
          />
        </View>
      }
    />
  );
}
