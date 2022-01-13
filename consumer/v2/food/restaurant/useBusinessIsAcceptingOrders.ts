import { Business, LatLng } from '@appjusto/types';
import firebase from 'firebase';
import { toNumber } from 'lodash';
import { usePlatformParamsContext } from '../../../../common/contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';
import { isAvailable } from '../../../../common/store/api/business/selectors';
import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import { formatTime } from '../../../../common/utils/formatters';

type AcceptingStatus = 'disconnected' | 'closed' | 'out-of-range' | 'unsupported' | 'accepting';

export const useBusinessIsAcceptingOrders = (
  business?: Business,
  destination?: LatLng
): AcceptingStatus => {
  const platformParams = usePlatformParamsContext();
  const getServerTime = useContextGetSeverTime();
  if (!platformParams || !getServerTime || !business) return 'disconnected';
  const now = getServerTime();
  if (
    !business.enabled ||
    business.status !== 'open' ||
    !business.keepAlive ||
    !isAvailable(business.schedules, now)
  )
    return 'closed';
  const keepAlive = (business.keepAlive as firebase.firestore.Timestamp).toDate();
  if (now.getTime() - keepAlive.getTime() > platformParams.business.keepAliveThreshold * 1000)
    return 'closed';
  // range
  const distance =
    destination && business?.businessAddress?.latlng
      ? distanceBetweenLatLng(destination, business.businessAddress.latlng)
      : 0;
  if (business?.deliveryRange ?? 0 < distance ?? 0) return 'out-of-range';
  // out of support time
  const hour = toNumber(formatTime(now, 'raw'));
  if (
    hour < toNumber(platformParams.consumer.support.starts ?? '1000') ||
    hour > toNumber(platformParams.consumer.support.ends ?? '2300')
  )
    return 'unsupported';

  return 'accepting';
};
