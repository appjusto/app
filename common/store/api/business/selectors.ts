import { Business } from '@appjusto/types';
import { toNumber } from 'lodash';
import { formatTime } from '../../../utils/formatters';

export const getBusinessNextOpeningDay = (business: Business) => {
  const now = new Date();
  const day = now.getDay();
  const index = day === 0 ? 6 : day - 1;
  const schedules = [...business.schedules.slice(index, 7), ...business.schedules.slice(0, index)];
  return schedules?.find(
    (o, i) =>
      o.checked &&
      (i > 0 || o.schedule.some((value) => toNumber(value.from) > toNumber(formatTime(now, 'raw'))))
  );
};
