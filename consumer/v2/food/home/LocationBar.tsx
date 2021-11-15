import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getCurrentPlace } from '../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, texts } from '../../../../common/styles';
import { formatAddress } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

export const LocationBar = () => {
  // redux store
  const currentPlace = useSelector(getCurrentPlace);
  // UI
  return (
    <View
      style={{
        ...borders.default,
        backgroundColor: colors.grey50,
        width: '100%',
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 32,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons name="gps-fixed" size={16} />
        <View style={{ width: '80%', marginLeft: halfPadding }}>
          <Text style={{ ...texts.xs, flexWrap: 'wrap' }}>
            {currentPlace?.address ? formatAddress(currentPlace.address) : ''}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ ...texts.xs, color: colors.green600 }}>{t('Trocar')}</Text>
      </View>
    </View>
  );
};
