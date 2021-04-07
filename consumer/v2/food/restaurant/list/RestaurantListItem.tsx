import { BusinessAlgolia } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import HR from '../../../../../common/components/views/HR';
import { useBusinessLogoURI } from '../../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { formatDistance } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { ListItemImage } from './ListItemImage';

type Props = {
  restaurant: BusinessAlgolia;
  cuisine: string | undefined;
  distance: number | undefined;
  secondary?: boolean;
};

export const RestaurantListItem = ({ restaurant, cuisine, distance, secondary }: Props) => {
  const { data: logo } = useBusinessLogoURI(restaurant.objectID);
  const outOfRange = (restaurant.deliveryRange ?? 0) < (distance ?? 0);
  return (
    <View style={{ justifyContent: 'center' }}>
      <HR />
      <View
        style={{
          flexDirection: 'row',
          marginLeft: padding,
          marginRight: 4,
          justifyContent: 'space-between',
          paddingTop: halfPadding,
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <Text style={{ ...texts.sm }}>{restaurant.name}</Text>
          <Text style={{ ...texts.xs, color: secondary ? colors.grey700 : colors.green600 }}>
            {t(cuisine ?? '')}
          </Text>
          {distance && !outOfRange ? (
            <Text style={{ ...texts.xs, color: secondary ? colors.green600 : colors.grey700 }}>
              {formatDistance(distance)}
            </Text>
          ) : null}
          {distance && outOfRange ? (
            <View style={{ marginTop: halfPadding }}>
              <RoundedText backgroundColor={colors.grey50} color={colors.grey700} noBorder>
                {`${t('Raio de entrega: ')} ${formatDistance(restaurant.deliveryRange!)}`}
              </RoundedText>
            </View>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ListItemImage uri={logo} height={80} width={64} />
        </View>
      </View>
    </View>
  );
};
