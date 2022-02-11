import React from 'react';
import { Text, View } from 'react-native';
import { colors, halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const OrderManagerHeader = () => {
  return (
    <View
      style={{ height: 48, width: '100%', flexDirection: 'row', backgroundColor: colors.white }}
    >
      <View
        style={{
          height: 48,
          width: 48,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.black,
          marginRight: padding,
        }}
      >
        {/* replace this with logo Image */}
        <Text style={{ color: colors.white }}>LOGO</Text>
      </View>
      <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
        {/* restaurant.name */}
        <Text style={{ ...texts.lg }}>{t('Nome do restaurante')}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* green if open, red if closed */}
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: colors.green500,
              marginRight: halfPadding,
              marginTop: halfPadding,
              bottom: 2,
            }}
          />
          {/* always uppercase */}
          <Text style={{ ...texts.x2s, color: colors.green600 }}>{t('RESTAURANTE ABERTO')}</Text>
        </View>
      </View>
    </View>
  );
};
