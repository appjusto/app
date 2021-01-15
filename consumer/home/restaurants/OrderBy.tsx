import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CheckField from '../../../common/components/buttons/CheckField';
import RadioButton from '../../../common/components/buttons/RadioButton';
import RoundedText from '../../../common/components/texts/RoundedText';
import { colors, halfPadding, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import SingleHeader from './SingleHeader';
import { RestaurantsNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  //state
  const [selectedFilter, setSelectedFilter] = React.useState<string>('');
  const navigateBackWithFilter = React.useCallback(
    (title: string) => {
      setSelectedFilter(title);
      navigation.navigate('RestaurantsHome', { selectedFilter });
    },
    [selectedFilter]
  );
  const data = [
    {
      title: 'Adicionados recentemente',
      onPress: () => navigateBackWithFilter('Adicionados recentemente'),
      checked: selectedFilter === 'Adicionados recentemente',
      id: '0',
    },
    {
      title: 'Menores preços',
      onPress: () => navigateBackWithFilter('Menores preços'),
      checked: selectedFilter === 'Menores preços',
      id: '1',
    },
    {
      title: 'Menor tempo de entrega',
      onPress: () => navigateBackWithFilter('Menor tempo de entrega'),
      checked: selectedFilter === 'Menor tempo de entrega',
      id: '2',
    },
    {
      title: 'Menor distância',
      onPress: () => navigateBackWithFilter('Menor distância'),
      checked: selectedFilter === 'Menor distância',
      id: '3',
    },
  ];
  //UI

  return (
    <View style={{ ...screens.default }}>
      <FlatList
        data={data}
        ListHeaderComponent={
          <View style={{ marginTop: padding }}>
            <SingleHeader title={t('Ordernar por')} />
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
          </View>
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: padding, marginBottom: halfPadding }}>
            <RadioButton title={item.title} onPress={item.onPress} checked={item.checked} />
          </View>
        )}
      />
      <View>
        <SingleHeader title={t('Categorias')} />
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
        <SingleHeader title={t('Classificações especiais')} />
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
          <CheckField
            text={t('Vegano')}
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
          <CheckField text="Orgânico" onPress={() => null} style={{ marginBottom: halfPadding }} />
          <CheckField
            text={t('Sem glúten')}
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
          <CheckField
            text={t('Sem açúcar')}
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
          <CheckField
            text={t('Zero lactose')}
            onPress={() => null}
            style={{ marginBottom: halfPadding }}
          />
        </View>
      </View>
    </View>
  );
}
