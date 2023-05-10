import { OrderCourier } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import React from 'react';
import { Text, View } from 'react-native';
import RoundedProfileImg from '../../../../common/components/icons/RoundedProfileImg';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { colors, padding, texts } from '../../../../common/styles';
import { formatDate } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';

type Props = {
  courier: OrderCourier;
};

export const OrderCourierSummary = ({ courier }: Props) => {
  return (
    <View>
      <SingleHeader title={t('Sobre o/a entregador/a')} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: padding,
          paddingHorizontal: padding,
        }}
      >
        <View>
          <RoundedProfileImg flavor="courier" id={courier.id} size={64} />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ ...texts.md }}>{courier.name}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700, marginTop: 8 }}>
            {t('No appJusto desde')}
          </Text>
          <Text style={{ ...texts.xs }}>
            {formatDate((courier.joined as FirebaseFirestoreTypes.Timestamp).toDate(), 'monthYear')}
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
          <Text style={{ ...texts.md }}>{courier.statistics?.deliveries ?? 0}</Text>
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
          <Text style={{ ...texts.md }}>{courier.statistics?.positiveReviews ?? 0}</Text>
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
          <Text style={{ ...texts.md }}>{courier.statistics?.negativeReviews ?? 0}</Text>
        </View>
      </View>
    </View>
  );
};
