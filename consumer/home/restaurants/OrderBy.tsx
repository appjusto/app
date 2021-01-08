import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CheckField from '../../../common/components/buttons/CheckField';
import RadioButton from '../../../common/components/buttons/RadioButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import { colors, halfPadding, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';
import SingleHeader from './SingleHeader';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  //UI

  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ marginTop: padding }}>
        <SingleHeader title="Ordernar por" />
        <View
          style={{
            borderBottomWidth: 1,
            borderStyle: 'solid',
            width: '100%',
            borderColor: colors.grey,
            marginTop: halfPadding,
            marginBottom: padding,
          }}
        />
        {/* this will be a list of filters displayed in RadioButton components.
        the data will come from firebase  */}
        <View style={{ marginHorizontal: padding }}>
          <RadioButton title="Adicionados recentemente" onPress={() => null} />
          <RadioButton title="Mais antigos" onPress={() => null} />
          <RadioButton title="Menores preços" onPress={() => null} />
          <RadioButton title="Menor tempo de entrega" onPress={() => null} />
          <RadioButton title="Menor distância" onPress={() => null} />
          <RadioButton title="Listagem de A-Z" onPress={() => null} />
          <RadioButton title="Listagem de Z-A" onPress={() => null} />
        </View>
      </View>
      <View style={{ marginTop: padding }}>
        <SingleHeader title="Categorias" />
        <View
          style={{
            borderBottomWidth: 1,
            borderStyle: 'solid',
            width: '100%',
            borderColor: colors.grey,
            marginTop: halfPadding,
            marginBottom: padding,
          }}
        />
        {/* this will be a list of categories. the data will come from firebase  
        TODO: make a touchable/interactive RoundedText component*/}
        <View style={{ marginHorizontal: padding }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <RoundedText>{t('Categoria')}</RoundedText>
            <RoundedText>{t('Categoria')}</RoundedText>
            <RoundedText>{t('Categoria')}</RoundedText>
            <RoundedText>{t('Categoria')}</RoundedText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: halfPadding,
            }}
          >
            <RoundedText>{t('Categoria')}</RoundedText>
            <RoundedText>{t('Categoria')}</RoundedText>
            <RoundedText>{t('Categoria')}</RoundedText>
            <RoundedText>{t('Categoria')}</RoundedText>
          </View>
        </View>
      </View>
      <View style={{ marginTop: padding }}>
        <SingleHeader title="Classificações especiais" />
        <View
          style={{
            borderBottomWidth: 1,
            borderStyle: 'solid',
            width: '100%',
            borderColor: colors.grey,
            marginTop: halfPadding,
            marginBottom: padding,
          }}
        />
        {/* this will be a list of items displayed in Checkfield components.
        the data will come from firebase  */}
        <View style={{ marginHorizontal: padding }}>
          <CheckField
            text="Vegetariano"
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
          <CheckField text="Vegano" onPress={() => null} style={{ marginBottom: halfPadding }} />
          <CheckField text="Orgânico" onPress={() => null} style={{ marginBottom: halfPadding }} />
          <CheckField
            text="Sem glúten"
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
          <CheckField
            text="Sem açúcar"
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
          <CheckField
            text="Zero lactose"
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
