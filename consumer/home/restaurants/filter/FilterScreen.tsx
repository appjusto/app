import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../common/app/context';
import CheckField from '../../../../common/components/buttons/CheckField';
import RadioButton from '../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import HR from '../../../../common/components/views/HR';
import useCuisines from '../../../../common/store/api/platform/hooks/useCuisines';
import { useFoodClassifications } from '../../../../common/store/api/platform/hooks/useFoodClassifications';
import { updateSearchFilters, updateSearchOrder } from '../../../../common/store/consumer/actions';
import {
  getSearchFilters,
  getSearchKind,
  getSearchOrder,
} from '../../../../common/store/consumer/selectors';
import { SearchOrder } from '../../../../common/store/consumer/types';
import { colors, halfPadding, padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import SingleHeader from '../SingleHeader';
import { RestaurantsNavigatorParamList } from '../types';

type OrderByItem = {
  title: string;
  value: SearchOrder;
};

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

const orderByOptions: OrderByItem[] = [
  {
    title: t('Menor distância'),
    value: 'distance',
  },
  {
    title: t('Menor preço'),
    value: 'price',
  },
  {
    title: t('Menor tempo de preparo'),
    value: 'preparation-time',
  },
  {
    title: t('Popularidade'),
    value: 'popularity',
  },
];

export default function ({ navigation }: Props) {
  // redux
  const dispatch = useDispatch<AppDispatch>();
  const kind = useSelector(getSearchKind);
  const order = useSelector(getSearchOrder);
  const filters = useSelector(getSearchFilters);
  // state
  const cuisines = useCuisines();
  const classifications = useFoodClassifications();
  const selectedCuisines = filters.filter((f) => f.type === 'cuisine');
  const selectedClassifications = filters.filter((f) => f.type === 'classification');
  // UI
  return (
    <ScrollView style={{ ...screens.default }}>
      {/* order by */}
      <View>
        <SingleHeader title={t('Ordernar por')} />
        <HR height={1} style={{ paddingTop: halfPadding }} />
        <PaddedView>
          {orderByOptions.map((item) => (
            <View key={item.value} style={{ marginTop: halfPadding }}>
              <RadioButton
                title={item.title}
                onPress={() => dispatch(updateSearchOrder(item.value))}
                checked={item.value === order}
              />
            </View>
          ))}
        </PaddedView>
      </View>
      {/* restaurants */}
      {kind === 'restaurant' && cuisines && (
        <View>
          <SingleHeader title={t('Categorias')} />
          <HR height={1} style={{ paddingTop: halfPadding }} />
          <PaddedView style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {cuisines.map((cuisine) => {
              const selected =
                selectedCuisines.find((item) => item.value === cuisine.id) !== undefined;
              return (
                <TouchableWithoutFeedback
                  key={cuisine.id}
                  onPress={() => {
                    if (!selected)
                      dispatch(
                        updateSearchFilters([...filters, { type: 'cuisine', value: cuisine.id }])
                      );
                    else
                      dispatch(
                        updateSearchFilters(filters.filter((item) => item.value !== cuisine.id))
                      );
                  }}
                >
                  <RoundedText
                    backgroundColor={selected ? colors.green500 : colors.white}
                    style={{ marginRight: padding, marginBottom: 12 }}
                  >
                    {cuisine.name}
                  </RoundedText>
                </TouchableWithoutFeedback>
              );
            })}
          </PaddedView>
        </View>
      )}
      {/* product */}
      {kind === 'product' && classifications && (
        <View>
          <SingleHeader title={t('Classificações especiais')} />
          <HR height={1} style={{ paddingTop: halfPadding }} />
          <PaddedView>
            {classifications?.map((classification) => {
              const selected =
                selectedClassifications.find((item) => item.value === classification.id) !==
                undefined;
              return (
                <View key={classification.id} style={{ marginTop: halfPadding }}>
                  <CheckField
                    text={classification.name}
                    onPress={() => {
                      if (!selected)
                        dispatch(
                          updateSearchFilters([
                            ...filters,
                            { type: 'classification', value: classification.id },
                          ])
                        );
                      else
                        dispatch(
                          updateSearchFilters(
                            filters.filter((item) => item.value !== classification.id)
                          )
                        );
                    }}
                    checked={selected}
                  />
                </View>
              );
            })}
          </PaddedView>
        </View>
      )}
    </ScrollView>
  );
}
