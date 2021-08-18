import { Business } from '@appjusto/types';
import { usePlatformParamsContext } from '../../../../common/contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../common/contexts/ServerTimeContext';

export const useBusinessIsAcceptingOrders = (business?: Business) => {
  const platformParams = usePlatformParamsContext();
  const getServerTime = useContextGetSeverTime();
  if (!platformParams) return false;
  if (!getServerTime) return false;
  if (!business) return false;
  if (!business.enabled) return false;
  if (business.status !== 'open') return false;
  if (!platformParams) return false;
  if (!business.keepAlive) return false;
  const keepAlive = (business.keepAlive as firebase.firestore.Timestamp).toDate();
  return (
    getServerTime().getTime() - keepAlive.getTime() <
    platformParams.business.keepAliveThreshold * 1000
  );
};
