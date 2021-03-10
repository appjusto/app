import { Product, ProductAlgolia, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { useProductImageURI } from '../../../../common/store/api/business/hooks/useProductImageURI';
import {
  useContextBusiness,
  useContextBusinessId,
} from '../../../../common/store/context/business';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import { ListItemImage } from './ListItemImage';

interface Props {
  product: ProductAlgolia | WithId<Product>;
  showRestaurantName?: boolean;
}

const isAlgoliaProduct = (product: ProductAlgolia | WithId<Product>): product is ProductAlgolia => {
  return (product as ProductAlgolia).objectID !== undefined;
};

export const ProductListItem = ({ product, showRestaurantName }: Props) => {
  // state
  const businessId = useContextBusinessId();
  const business = useContextBusiness();
  const productId = isAlgoliaProduct(product) ? product.objectID : product.id;
  const businessName = isAlgoliaProduct(product) ? product.business.name : business?.name;
  const { data: imageURI } = useProductImageURI(businessId, productId);
  // UI
  return (
    <View
      style={{
        borderTopWidth: 1,
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
          {showRestaurantName && businessName && (
            <Text style={{ ...texts.xs, color: colors.green600 }}>{businessName}</Text>
          )}
        </View>
        <View>
          <ListItemImage uri={imageURI} height={80} width={80} />
        </View>
      </View>
    </View>
  );
};
