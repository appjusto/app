import { Business, BusinessAlgolia } from '@appjusto/types';
import { capitalize } from 'lodash';
import React from 'react';
import { View } from 'react-native';
import RoundedText from '../../../../../../common/components/texts/RoundedText';
import { getNextAvailableDate } from '../../../../../../common/store/api/business/availability/selectors';
import { colors, padding } from '../../../../../../common/styles';
import { formatHour } from '../../../../../../common/utils/formatters';
import { useServerTime } from '../../../../../../common/utils/platform/useServerTime';

type Props = {
  business: BusinessAlgolia | Business;
};

export const RestaurantNextAvailableDateLabel = ({ business }: Props) => {
  // context
  const now = useServerTime();
  const [day, hour] = getNextAvailableDate(business.schedules, now()) ?? [];
  // UI
  if (!day || !hour) return null;
  return (
    <View style={{ marginLeft: padding }}>
      <RoundedText backgroundColor={colors.green100} color={colors.black} noBorder>
        {`Abre ${capitalize(day)} às ${formatHour(hour)}`}
      </RoundedText>
    </View>
  );
};
