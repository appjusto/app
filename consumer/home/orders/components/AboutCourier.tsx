import { MaterialIcons } from '@expo/vector-icons';
import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedProfileImg from '../../../../common/components/icons/RoundedProfileImg';
import { colors, padding, texts } from '../../../../common/styles';
import { formatDate } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import SingleHeader from '../../restaurants/SingleHeader';

type Props = {
  order: WithId<Order>;
};

export const AboutCourier = ({ order }: Props) => {
  return (
    <View>
      <SingleHeader title={t('Sobre o entregador')} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: padding,
          paddingHorizontal: padding,
        }}
      >
        <View>
          <RoundedProfileImg flavor="courier" id={order.courier!.id} />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ ...texts.md }}>{order.courier?.name}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700, marginTop: 8 }}>
            {t('No appJusto desde')}
          </Text>
          <Text style={{ ...texts.xs }}>
            {formatDate(
              (order.courier!.joined as firebase.firestore.Timestamp).toDate(),
              'monthYear'
            )}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          paddingHorizontal: padding,
        }}
      >
        <MaterialIcons name="check" size={24} />
        <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {t('Entregas realizadas perfeitamente')}
          </Text>
          <Text style={{ ...texts.md }}>{order.courier?.statistics?.deliveries ?? 0}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          paddingHorizontal: padding,
        }}
      >
        <MaterialIcons name="highlight-remove" size={24} />
        <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Entregas canceladas')}</Text>
          <Text style={{ ...texts.md }}>{order.courier?.statistics?.canceled ?? 0}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          paddingHorizontal: padding,
        }}
      >
        <MaterialIcons name="thumb-up-off-alt" size={24} />
        <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Avaliações positivas')}</Text>
          <Text style={{ ...texts.md }}>{order.courier?.statistics?.negativeReviews ?? 0}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          paddingHorizontal: padding,
        }}
      >
        <MaterialIcons name="thumb-down-off-alt" size={24} />
        <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Avaliações negativas')}</Text>
          <Text style={{ ...texts.md }}>{order.courier?.statistics?.negativeReviews ?? 0}</Text>
        </View>
      </View>
    </View>
  );
};
