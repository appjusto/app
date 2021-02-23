import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getSearchKind } from '../../../../../common/store/consumer/selectors';
import { SearchKind } from '../../../../../common/store/consumer/types';
import { borders, colors, halfPadding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import FilterButton from './FilterButton';

const data: SearchKind[] = [
  { type: 'kind', value: 'restaurant', title: t('Restaurantes') },
  { type: 'kind', value: 'product', title: t('Pratos') },
];

type Props = {
  onFilterChange: (value: SearchKind) => void;
  onFilterOpen: () => void;
};

export default function ({ onFilterChange, onFilterOpen }: Props) {
  // redux store
  const selectedSearchKing = useSelector(getSearchKind);
  console.log('selectedSearchKing', selectedSearchKing);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <FilterButton onPress={onFilterOpen} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => {
              onFilterChange(item);
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
                backgroundColor:
                  item.value === selectedSearchKing?.value ? colors.green500 : colors.white,
                borderColor: colors.black,
              }}
            >
              <Text
                style={{
                  ...texts.sm,
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
