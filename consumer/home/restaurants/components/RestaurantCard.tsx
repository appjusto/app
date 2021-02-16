import { Business, WithId } from 'appjusto-types';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import * as icons from '../../../../assets/icons';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { useBusinessCoverImageURI } from '../../../../common/store/api/business/hooks/useBusinessCoverImageURI';
import { colors, halfPadding, texts } from '../../../../common/styles';
import {
  formatDistance,
  formatDuration,
  separateWithDot,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  restaurant: WithId<Business>;
  onPress?: () => void;
  canNavigate?: boolean;
};

export default function ({ restaurant, onPress, canNavigate }: Props) {
  const { data: coverURI } = useBusinessCoverImageURI(restaurant.id);
  return (
    <View style={{ marginHorizontal: 12 }}>
      <TouchableOpacity onPress={onPress}>
        <View>
          <View style={{ height: 120, width: '100%', borderRadius: 8 }}>
            {coverURI && (
              <Image source={{ uri: coverURI }} style={{ height: 120, width: '100%' }} />
            )}
          </View>
          {canNavigate && (
            <View style={{ position: 'absolute', right: halfPadding, bottom: halfPadding }}>
              <RoundedText>{t('Saber mais')}</RoundedText>
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
            <Text style={{ ...texts.xl }}>{restaurant.name}</Text>
            <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Tipo de comida')}</Text>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>
              {separateWithDot(formatDistance(2000), formatDuration(1800))}
            </Text>
          </View>
          <View>
            <Image source={icons.cardIcon} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
