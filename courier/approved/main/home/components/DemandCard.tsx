import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { borders, colors, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

export const DemandCard = () => {
  return (
    <View
      style={{
        ...borders.default,
        flex: 1,
        borderColor: colors.grey50,
        paddingHorizontal: 12,
        paddingVertical: padding,
      }}
    >
      <Text style={{ ...texts.md }}>{t('Como está a demanda agora:')}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: padding,
          width: '100%',
        }}
      >
        <View
          style={{
            ...borders.default,
            paddingHorizontal: 12,
            paddingVertical: padding,
            alignItems: 'center',
            width: '33%',
            borderColor: colors.grey50,
          }}
        >
          <MaterialIcons name="insert-emoticon" size={24} color={colors.green500} />
          <Text style={{ ...texts.xxl, marginVertical: padding }}>{t('000')}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Pedidos na última hora')}</Text>
        </View>
        <View
          style={{
            ...borders.default,
            paddingHorizontal: 12,
            paddingVertical: padding,
            alignItems: 'center',
            width: '33%',
            borderColor: colors.grey50,
          }}
        >
          <MaterialIcons name="motorcycle" size={24} color={colors.green500} />
          <Text style={{ ...texts.xxl, marginVertical: padding }}>{t('000')}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Entregadores ativos')}</Text>
        </View>
        <View
          style={{
            ...borders.default,
            paddingHorizontal: 12,
            paddingVertical: padding,
            alignItems: 'center',
            width: '33%',
            borderColor: colors.grey50,
          }}
        >
          <MaterialIcons name="local-dining" size={24} color={colors.green500} />
          <Text style={{ ...texts.xxl, marginVertical: padding }}>{t('000')}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Restaurantes abertos')}</Text>
        </View>
      </View>
    </View>
  );
};
