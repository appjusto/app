import dayjs from 'dayjs';
import { usePlatformParamsContext } from '../../../../../common/contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../../common/contexts/ServerTimeContext';

export const useCanAdvanceReceivables = () => {
  const getServerTime = useContextGetSeverTime()!;
  const platformParams = usePlatformParamsContext();
  if (!platformParams) return false;
  const { advances } = platformParams.marketplace;
  const now = dayjs(getServerTime()).tz('America/Sao_Paulo');
  if (!advances.daysOfWeek.includes(now.isoWeekday())) return false;
  const startAt = dayjs(now).hour(advances.startAt).minute(0).second(0).millisecond(0);
  const endAt = dayjs(now).hour(advances.endAt).minute(0).second(0).millisecond(0);
  return startAt.isBefore(now) && endAt.isAfter(now);
};
