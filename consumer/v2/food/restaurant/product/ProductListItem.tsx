import { Product, ProductAlgolia, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import { useProductImageURI } from '../../../../../common/store/api/business/hooks/useProductImageURI';
import { useContextBusiness } from '../../../../../common/store/context/business';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { ListItemImage } from '../list/ListItemImage';

interface Props {
  product: ProductAlgolia | WithId<Product>;
  showRestaurantName?: boolean;
  complements?: boolean;
}

const isAlgoliaProduct = (product: ProductAlgolia | WithId<Product>): product is ProductAlgolia => {
  return (product as ProductAlgolia).objectID !== undefined;
};

export const ProductListItem = ({ product, showRestaurantName, complements }: Props) => {
  // state
  const business = useContextBusiness();
  const businessId = isAlgoliaProduct(product) ? product.business.id : business?.id;
  const productId = isAlgoliaProduct(product) ? product.objectID : product.id;
  const businessName = isAlgoliaProduct(product) ? product.business.name : business?.name;
  const { data: imageURI } = useProductImageURI(businessId!, productId);

  // UI
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderStyle: 'solid',
        width: '100%',
        borderColor: colors.grey50,
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
          <Text style={{ ...texts.sm }}>
            {complements
              ? `${t('A partir de ')} ${formatCurrency(product.price)}`
              : formatCurrency(product.price)}
          </Text>
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
