import React from 'react';
import { Text, View } from 'react-native';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatDate } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import SingleHeader from '../../restaurants/SingleHeader';

type Props = {
  comment: string;
  date: Date;
};

export const CourierEvals = ({ comment, date }: Props) => {
  return (
    <View>
      <SingleHeader title={t('Avaliações recebidas')} />
      <View style={{ marginLeft: padding }}>
        <View style={{ ...borders.default, width: 240, padding }}>
          <Text numberOfLines={3} style={{ ...texts.sm, color: colors.grey700, flexWrap: 'wrap' }}>
            {comment}
          </Text>
        </View>
        <Text style={{ ...texts.xs, color: colors.green600, marginTop: halfPadding }}>
          {formatDate(date, 'monthYear')}
        </Text>
      </View>
    </View>
  );
};
