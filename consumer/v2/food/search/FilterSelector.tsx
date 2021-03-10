import React from 'react';
import { FlatList, Text, TouchableWithoutFeedback, View, ViewProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../common/app/context';
import { updateSearchKind } from '../../../../common/store/consumer/actions';
import { getSearchKind } from '../../../../common/store/consumer/selectors';
import { SearchKind } from '../../../../common/store/consumer/types';
import { borders, colors, halfPadding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import FilterButton from '../../../home/restaurants/components/filter/FilterButton';

type Item = {
  kind: SearchKind;
  title: string;
};

const data: Item[] = [
  { kind: 'restaurant', title: t('Restaurantes') },
  { kind: 'product', title: t('Pratos') },
];

interface Props extends ViewProps {
  onFilterOpen: () => void;
}

export default function ({ style, onFilterOpen }: Props) {
  // redux store
  const dispatch = useDispatch<AppDispatch>();
  const selectedSearchKind = useSelector(getSearchKind);
  // UI
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      <FilterButton onPress={onFilterOpen} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        keyExtractor={(item) => item.kind}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => {
              dispatch(updateSearchKind(item.kind));
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
                backgroundColor: item.kind === selectedSearchKind ? colors.green500 : colors.white,
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
