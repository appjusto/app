import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { useBusinessLogoURI } from '../../../../common/store/api/business/hooks/useBusinessLogoURI';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatDistance } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ListItemImage } from '../components/ListItemImage';

type Props = {
  restaurant: WithId<Partial<Business>>;
  cuisine: string | undefined;
  distance: number | undefined;
};

export default function ({ restaurant, cuisine, distance }: Props) {
  const { data: logo } = useBusinessLogoURI(restaurant.id);
  return (
    <View style={{ marginTop: halfPadding }}>
      <View
        style={{
          borderBottomWidth: 1,
          borderStyle: 'solid',
          width: '100%',
          borderColor: colors.grey,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: padding,
          marginTop: halfPadding,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ marginTop: 12 }}>
          <Text style={{ ...texts.default }}>{restaurant.name}</Text>
          <Text style={{ ...texts.small, color: colors.darkGreen }}>{t(cuisine ?? '')}</Text>
          {distance && (
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {formatDistance(distance)}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ListItemImage uri={logo} />
        </View>
      </View>
    </View>
  );
}
