import { Business, LatLng } from '@appjusto/types';
import { toNumber } from 'lodash';
import { usePlatformParamsContext } from '../../../../common/contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { isAvailable } from '../../../../common/store/api/business/selectors';
import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import { formatTime } from '../../../../common/utils/formatters';

type AcceptingStatus = 'disconnected' | 'closed' | 'out-of-range' | 'unsupported' | 'accepting';

export const useBusinessIsAcceptingOrders = (
  business?: Business,
  destination?: LatLng | null
): AcceptingStatus => {
  const platformParams = usePlatformParamsContext();
  const getServerTime = useContextGetSeverTime();
  if (!platformParams || !getServerTime || !business) return 'disconnected';
  const now = getServerTime();
  if (!business.enabled || !isAvailable(business.schedules, now)) return 'closed';
  if (
    (business.status !== 'open' || !business.keepAlive) &&
    !business.preparationModes?.includes('scheduled')
  )
    return 'disconnected';
  // const keepAlive = (business.keepAlive as Timestamp).toDate();
  // if (now.getTime() - keepAlive.getTime() > platformParams.business.keepAliveThreshold * 1000)
  //   return 'closed';
  // range
  const distance =
    destination && business?.businessAddress?.latlng
      ? distanceBetweenLatLng(destination, business.businessAddress.latlng)
      : 0;
  if (business.deliveryRange) {
    if (business.deliveryRange < distance ?? 0) return 'out-of-range';
  }
  // out of support time
  const hour = toNumber(formatTime(now, 'raw'));
  if (
    hour < toNumber(platformParams.consumer.support.starts ?? '900') ||
    hour > toNumber(platformParams.consumer.support.ends ?? '2300')
  )
    return 'unsupported';

  return 'accepting';
};
