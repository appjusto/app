import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import { HorizontalSelectItem } from '../../../../../common/components/buttons/HorizontalSelect';
import {
  getProductSearchParameters,
  getRestaurantsSearchParams,
} from '../../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, texts } from '../../../../../common/styles';
import FilterButton from './FilterButton';

type Props = {
  data: HorizontalSelectItem[];
  selected?: HorizontalSelectItem;
  onFilterChange: (value: HorizontalSelectItem) => void;
  onFilter: () => void;
};

export default function ({ data, selected, onFilterChange: onSelect, onFilter }: Props) {
  // redux store
  const restaurantsSearchParams = useSelector(getRestaurantsSearchParams);
  const productSearchParameters = useSelector(getProductSearchParameters);
  console.log('restaurantsSearchParams', restaurantsSearchParams);
  console.log('productSearchParameters', productSearchParameters);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FilterButton onPress={onFilter} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => {
              onSelect(item);
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 4,
                paddingHorizontal: halfPadding,
                ...borders.default,
                borderRadius: 32,
                // height: 32,
                marginLeft: 8,
                backgroundColor: item.id === selected?.id ? colors.green : colors.white,
                borderColor: colors.black,
              }}
            >
              <Text
                style={{
                  ...texts.default,
                  color: colors.black,
                }}
              >
                {item.title}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
}
