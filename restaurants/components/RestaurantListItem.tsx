import React from 'react';
import { View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { colors, halfPadding, padding, texts } from '../../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../../common/utils/formatters';
import { t } from '../../strings';
import * as fake from '../fakeData';

type Props = {
  onPress: () => void;
  name: string;
};

export default function ({ onPress, name }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
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
            <Text style={{ ...texts.default }}>{name}</Text>
            {/* hardcoded infos below for now */}
            <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>
              {separateWithDot(formatDistance(2000), formatDuration(1800))}
            </Text>
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
    </TouchableOpacity>
  );
}
