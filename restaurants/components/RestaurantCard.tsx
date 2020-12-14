import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import RoundedText from '../../common/components/texts/RoundedText';
import { colors, halfPadding, texts } from '../../common/styles';
import { formatDistance, formatDuration, separateWithDot } from '../../common/utils/formatters';
import { t } from '../../strings';
import * as fake from '../fakeData';

type Props = {
  name: string;
  onPress?: () => void;
  canNavigate?: boolean;
};

export default function ({ name, onPress, canNavigate }: Props) {
  return (
    <View style={{ marginHorizontal: 12 }}>
      <View>
        <Image source={fake.card} style={{ height: 120, width: '100%', borderRadius: 8 }} />
        {canNavigate && (
          <View style={{ position: 'absolute', right: halfPadding, bottom: halfPadding }}>
            <TouchableOpacity onPress={onPress}>
              <RoundedText>{t('Saber mais')}</RoundedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ ...texts.mediumToBig }}>{name}</Text>
          <Text style={{ ...texts.small, color: colors.darkGreen }}>{t('Tipo de comida')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {separateWithDot(formatDistance(2000), formatDuration(1800))}
          </Text>
        </View>
        <View>
          <Image source={fake.cardIcon} />
        </View>
      </View>
    </View>
  );
}
