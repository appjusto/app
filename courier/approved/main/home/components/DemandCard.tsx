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
        borderColor: colors.lightGrey,
        paddingHorizontal: 12,
        paddingVertical: padding,
      }}
    >
      <Text style={{ ...texts.medium }}>{t('Como está a demanda agora:')}</Text>
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
            borderColor: colors.lightGrey,
          }}
        >
          <MaterialIcons name="insert-emoticon" size={24} color={colors.green} />
          <Text style={{ ...texts.big, marginVertical: padding }}>{t('000')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {t('Pedidos na última hora')}
          </Text>
        </View>
        <View
          style={{
            ...borders.default,
            paddingHorizontal: 12,
            paddingVertical: padding,
            alignItems: 'center',
            width: '33%',
            borderColor: colors.lightGrey,
          }}
        >
          <MaterialIcons name="motorcycle" size={24} color={colors.green} />
          <Text style={{ ...texts.big, marginVertical: padding }}>{t('000')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>{t('Entregadores ativos')}</Text>
        </View>
        <View
          style={{
            ...borders.default,
            paddingHorizontal: 12,
            paddingVertical: padding,
            alignItems: 'center',
            width: '33%',
            borderColor: colors.lightGrey,
          }}
        >
          <MaterialIcons name="local-dining" size={24} color={colors.green} />
          <Text style={{ ...texts.big, marginVertical: padding }}>{t('000')}</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>
            {t('Restaurantes abertos')}
          </Text>
        </View>
      </View>
    </View>
  );
};
