import { BusinessSchedule } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import { useProductImageURI } from '../../../../../common/store/api/business/hooks/useProductImageURI';
import { isBusinessOpen } from '../../../../../common/store/api/business/selectors';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatCurrency } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { ListItemImage } from '../list/ListItemImage';

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    availability?: BusinessSchedule;
  };
  business: {
    id: string;
    name?: string;
  };
  hasComplements?: boolean;
  showRestaurantName?: boolean;
}

export const ProductListItem = ({
  product,
  business,
  hasComplements,
  showRestaurantName,
}: Props) => {
  const { data: imageURI } = useProductImageURI(business.id, product.id);
  const available = isBusinessOpen(product.availability, new Date());
  // UI
  if (!available) return null;
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
          <Text style={{ ...texts.sm, textTransform: 'capitalize' }}>{product.name}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700, marginVertical: 4 }} numberOfLines={2}>
            {product.description ?? ''}
          </Text>
          <Text style={{ ...texts.sm }}>
            {hasComplements
              ? `${t('A partir de ')} ${formatCurrency(product.price)}`
              : formatCurrency(product.price)}
          </Text>
          {showRestaurantName && business.name ? (
            <Text style={{ ...texts.xs, color: colors.green600 }}>{business.name}</Text>
          ) : null}
        </View>
        {imageURI ? (
          <View>
            <ListItemImage uri={imageURI} height={80} width={80} />
          </View>
        ) : null}
      </View>
    </View>
  );
};
