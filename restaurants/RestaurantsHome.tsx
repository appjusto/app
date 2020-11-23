import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../common/app/context';
import PaddedView from '../common/components/containers/PaddedView';
import RoundedText from '../common/components/texts/RoundedText';
import Pill from '../common/components/views/Pill';
import useTallerDevice from '../common/hooks/useTallerDevice';
import { getUser } from '../common/store/user/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../common/styles';
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
    <View>
      <View
        style={{
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          borderColor: colors.grey,
        }}
      />
      <View style={{ flexDirection: 'row', marginLeft: padding, marginTop: halfPadding }}>
        <View>
          <Text style={{ ...texts.default }}>{t('Nome do restaurante')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={{ ...screens.default }}>
      <SectionHeader title="Os mais queridos" subtitle="Os lugares mais pedidos da sua região" />
      <SectionHeader title="Buscar" subtitle="Já sabe o que quer? Então não perde tempo!" />
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
      {/* "OrderBy" component */}
      <View style={{ marginTop: padding }}>
        <RestaurantListItem />
      </View>
    </ScrollView>
  );
}
