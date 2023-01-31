import { toNumber } from 'lodash';
import { formatTime } from '../../../../utils/formatters';
import { usePlatformParams } from '../../../../utils/platform/usePlatformParams';
import { useServerTime } from '../../../../utils/platform/useServerTime';
import { PlatformAvailability } from './types';

export const usePlatformAvailability = (): PlatformAvailability | undefined => {
  //context
  const platformParams = usePlatformParams();
  const now = useServerTime();
  // result
  if (!platformParams?.consumer?.support?.starts || !platformParams?.consumer?.support?.ends) {
    return undefined;
  }
  const hour = toNumber(formatTime(now(), 'raw'));
  if (
    hour < toNumber(platformParams.consumer.support.starts) ||
    hour > toNumber(platformParams.consumer.support.ends)
  ) {
    return 'out-of-service';
  }
  return 'in-service';
};
