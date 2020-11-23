import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import * as icons from '../assets/icons';
import { ApiContext, AppDispatch } from '../common/app/context';
import PaddedView from '../common/components/containers/PaddedView';
import RoundedText from '../common/components/texts/RoundedText';
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

  //UI
  //maybe we're going to put the components below in separate files
  const SectionHeader = ({ title, subtitle, ...props }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, flex: 1 }} {...props}>
      <Pill tall />
      <View style={{ marginLeft: 12 }}>
        <Text style={{ ...texts.mediumToBig, color: colors.black }}>{t(title)}</Text>
        <Text style={{ ...texts.small, color: colors.darkGrey }}>{t(subtitle)}</Text>
      </View>
    </View>
  );

  const CategoriesBox = ({ category, image }) => (
    <TouchableOpacity onPress={() => null}>
      <View style={{ height: 96, width: 96, borderRadius: 8, marginRight: halfPadding }}>
        <Image source={image} />
        <View style={{ position: 'absolute', left: 4, bottom: 4 }}>
          <RoundedText>{t(category)}</RoundedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RestaurantListItem = () => (
    <TouchableOpacity>
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
            <Text style={{ ...texts.default }}>{t('Nome do restaurante')}</Text>
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
    <TouchableWithoutFeedback onPress={() => null} style={{ marginHorizontal: 12 }}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image source={icons.navigationArrow} />
          <Text style={{ ...texts.small }}>{t('Avenida Paulista, 1000, São Paulo, SP')}</Text>
        </View>
        <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Trocar')}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <ScrollView style={{ ...screens.default }}>
      <LocationBar />
      <SectionHeader title="Os mais queridos" subtitle="Os lugares mais pedidos da sua região" />
      {/* vertical flatlist displaying the "most liked" restaurants here */}
      <SectionHeader title="Buscar" subtitle="Já sabe o que quer? Então não perde tempo!" />
      <View style={{ marginTop: 24 }}>
        <RestaurantSearch />
      </View>
      <SectionHeader title="Tá com fome de que?" subtitle="Escolha por categoria" />
      <PaddedView style={{ flexDirection: 'row', marginTop: halfPadding }}>
        {/* replace with a flatlist */}
        <CategoriesBox category="Pizza" image={fake.pizza} />
        <CategoriesBox category="Oriental" image={fake.oriental} />
        <CategoriesBox category="Mexicano" image={fake.mexican} />
      </PaddedView>
      {/* replace the two sections below with a sectionlist with "open" and "closed" sections */}
      <SectionHeader
        title="Restaurantes abertos agora"
        subtitle="Valor justo para restaurantes e entregadores"
      />
      {/* "OrderBy" component  here*/}
      <View style={{ marginTop: padding }}>
        <RestaurantListItem />
        <RestaurantListItem />
        <RestaurantListItem />
        <RestaurantListItem />
      </View>
      <View style={{ marginTop: 24 }}>
        <SectionHeader title="Fechados no momento" subtitle="Fora do horário de funcionamento" />
        <RestaurantListItem />
        <RestaurantListItem />
        <RestaurantListItem />
        <RestaurantListItem />
      </View>
    </ScrollView>
  );
}
