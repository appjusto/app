import { Business, LatLng } from '@appjusto/types';
import { toNumber } from 'lodash';
import { usePlatformParamsContext } from '../../../../common/contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { isAvailable } from '../../../../common/store/api/business/selectors';
import { inDeliveryRange } from '../../../../common/store/api/helpers';
import { formatTime } from '../../../../common/utils/formatters';

type AcceptingStatus = 'unavailable' | 'closed' | 'out-of-range' | 'unsupported' | 'accepting';

export const useBusinessIsAcceptingOrders = (
  business?: Business,
  destination?: LatLng | null
): AcceptingStatus => {
  const platformParams = usePlatformParamsContext();
  const getServerTime = useContextGetSeverTime();
  if (!platformParams || !getServerTime || !business) return 'unavailable';
  const now = getServerTime();

  // out of support time
  const hour = toNumber(formatTime(now, 'raw'));
  if (
    hour < toNumber(platformParams.consumer.support.starts ?? '900') ||
    hour > toNumber(platformParams.consumer.support.ends ?? '2359')
  ) {
    return 'unsupported';
  }

  console.log('business.status', business.status, business.status !== 'available');

  if (business.status !== 'available') return 'unavailable';

  if (destination && !inDeliveryRange(business, destination)) {
    return 'out-of-range';
  }

  if (!isAvailable(business.schedules, now) && !business.preparationModes?.includes('scheduled'))
    return 'closed';

  return 'accepting';
};
