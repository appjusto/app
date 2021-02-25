import { ProductAlgolia } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { useProductImageURI } from '../../../../../common/store/api/business/hooks/useProductImageURI';
import { useContextBusinessId } from '../../../../../common/store/context/business';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { ListItemImage } from '../../components/ListItemImage';

interface Props {
  product: ProductAlgolia;
  showRestaurantName?: boolean;
}

export const ProductListItem = ({ product, showRestaurantName }: Props) => {
  // context
  const businessId = useContextBusinessId();
  // state
  const { data: imageURI } = useProductImageURI(businessId, product.id);
  // UI
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        borderColor: colors.grey500,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingLeft: padding,
          paddingRight: halfPadding,
          marginVertical: halfPadding,
        }}
      >
        <View style={{ width: '60%' }}>
          <Text style={{ ...texts.sm }}>{product.name}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700, marginVertical: 4 }} numberOfLines={2}>
            {product.description}
          </Text>
          <Text style={{ ...texts.sm }}>{formatCurrency(product.price)}</Text>
          {showRestaurantName && product.business?.name && (
            <Text style={{ ...texts.xs, color: colors.green600 }}>{product.business.name}</Text>
          )}
        </View>
        <View>
          <ListItemImage uri={imageURI} size={96} />
        </View>
      </View>
    </View>
  );
};
