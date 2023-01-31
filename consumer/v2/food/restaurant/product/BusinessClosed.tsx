import { Business } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { getNextAvailableDate } from '../../../../../common/store/api/business/availability/selectors';
import { borders, colors, padding, texts } from '../../../../../common/styles';
import { formatHour } from '../../../../../common/utils/formatters';
import { useServerTime } from '../../../../../common/utils/platform/useServerTime';
import { t } from '../../../../../strings';

interface Props {
  business?: Business;
}

export const BusinessClosed = ({ business }: Props) => {
  // context
  const now = useServerTime();
  if (!business) return null;
  const [day, hour] = getNextAvailableDate(business.schedules, now()) ?? [];
  // UI
  return (
    <View
      style={{
        margin: padding,
        padding: 25,
        alignItems: 'center',
        backgroundColor: colors.grey50,
        ...borders.default,
      }}
    >
      <Feather name="clock" size={26} />
      <Text style={texts.sm}>{t('Desculpe, estamos fechados agora')}</Text>
      {day && hour ? (
        <>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {`${t('Abriremos')} ${day} ${t('às')}`}
          </Text>
          <Text style={texts.x2l}>{formatHour(hour)}</Text>
        </>
      ) : null}
    </View>
  );
};
