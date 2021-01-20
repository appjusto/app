import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import ShowIf from '../../../../common/components/views/ShowIf';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatDistance } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import * as fake from '../fakeData';

type Props = {
  restaurant: WithId<Partial<Business>>;
  distance?: number;
};

export default function ({ restaurant, distance }: Props) {
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
          <Text style={{ ...texts.small, color: colors.darkGreen }}>
            {t(restaurant.cuisine?.name ?? '')}
          </Text>
          <ShowIf test={Boolean(distance)}>
            {() => (
              <Text style={{ ...texts.small, color: colors.darkGrey }}>
                {formatDistance(distance! * 1000)}
              </Text>
            )}
          </ShowIf>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Image source={fake.restLogo} height={64} width={64} />
          <Image source={fake.burger} height={80} width={64} style={{ borderRadius: 8 }} />
        </View>
      </View>
    </View>
  );
}
