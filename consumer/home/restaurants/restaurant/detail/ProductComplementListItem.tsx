import { Complement } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { QuantityButton } from '../../../../../common/components/buttons/QuantityButton';
import { colors, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import * as fake from '../../fakeData';

interface Props {
  complement: Complement;
  selected: boolean;
  onToggle: (selected: boolean) => void;
}

export const ProductComplementListItem = ({ complement, selected, onToggle }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={() => onToggle(!selected)}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: padding,
          paddingVertical: 12,
          // alignContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: colors.lightGrey,
        }}
      >
        <View>
          <QuantityButton sign={selected ? 'minus' : 'plus'} size="small" selected={selected} />
        </View>
        <View style={{ flex: 1, paddingHorizontal: padding }}>
          <Text style={{ ...texts.default }}>{complement.name}</Text>
          <Text
            style={{ ...texts.default, color: colors.darkGrey, marginTop: 4, flexWrap: 'wrap' }}
            numberOfLines={2}
          >
            {complement.description}
          </Text>
          <Text style={{ ...texts.default, marginTop: 4 }}>{formatCurrency(complement.price)}</Text>
        </View>
        <View>
          <Image
            source={complement.imageExists ? fake.itemRectangle : fake.itemRectangle}
            style={{ height: 96, width: 96, borderRadius: 8 }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
