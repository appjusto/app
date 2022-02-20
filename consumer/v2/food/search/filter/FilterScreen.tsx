import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../common/app/context';
import CheckField from '../../../../../common/components/buttons/CheckField';
import RadioButton from '../../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import useCuisines from '../../../../../common/store/api/platform/hooks/useCuisines';
import { useFoodClassifications } from '../../../../../common/store/api/platform/hooks/useFoodClassifications';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import {
  updateSearchFilters,
  updateSearchOrder,
} from '../../../../../common/store/consumer/actions';
import {
  getSearchFilters,
  getSearchKind,
  getSearchOrder,
} from '../../../../../common/store/consumer/selectors';
import { SearchOrder } from '../../../../../common/store/consumer/types';
import { colors, halfPadding, padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { FoodOrderNavigatorParamList } from '../../types';

type OrderByItem = {
  title: string;
  value: SearchOrder;
};

type ScreenNavigationProp = StackNavigationProp<FoodOrderNavigatorParamList, 'FilterScreen'>;

type Props = {
  navigation: ScreenNavigationProp;
};

const orderByOptions: OrderByItem[] = [
  {
    title: t('Menor distância'),
    value: 'distance',
  },
  {
    title: t('Maior desconto'),
    value: 'average-discount',
  },
  {
    title: t('Popularidade'),
    value: 'popularity',
  },
  {
    title: t('Menor preço'),
    value: 'price',
  },
  {
    title: t('Menor tempo de preparo'),
    value: 'preparation-time',
  },
];

export const FilterScreen = ({ navigation }: Props) => {
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
  // tracking
  useSegmentScreen('FilterScreen');
  // UI
  return (
    <ScrollView
      style={{ ...screens.default }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* order by */}
      <View>
        <SingleHeader title={t('Ordernar por')} />
        <HR height={1} />
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
      {kind === 'restaurant' && cuisines ? (
        <View>
          <SingleHeader title={t('Categorias')} />
          <HR height={1} />
          <PaddedView style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {cuisines.map((cuisine) => {
              const selected =
                selectedCuisines.find((item) => item.value === cuisine.name) !== undefined;
              return (
                <TouchableWithoutFeedback
                  key={cuisine.id}
                  onPress={() => {
                    track('updating restaurant search filters');
                    if (!selected)
                      dispatch(
                        updateSearchFilters([...filters, { type: 'cuisine', value: cuisine.name }])
                      );
                    else
                      dispatch(
                        updateSearchFilters(filters.filter((item) => item.value !== cuisine.name))
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
      ) : null}
      {/* product */}
      {kind === 'product' && classifications ? (
        <View>
          <SingleHeader title={t('Classificações especiais')} />
          <HR height={1} />
          <PaddedView>
            {classifications?.map((classification) => {
              const selected =
                selectedClassifications.find((item) => item.value === classification.name) !==
                undefined;
              return (
                <View key={classification.id} style={{ marginTop: halfPadding }}>
                  <CheckField
                    text={classification.name}
                    onPress={() => {
                      track('updating product search filters');
                      if (!selected)
                        dispatch(
                          updateSearchFilters([
                            ...filters,
                            { type: 'classification', value: classification.name },
                          ])
                        );
                      else
                        dispatch(
                          updateSearchFilters(
                            filters.filter((item) => item.value !== classification.name)
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
      ) : null}
    </ScrollView>
  );
};
