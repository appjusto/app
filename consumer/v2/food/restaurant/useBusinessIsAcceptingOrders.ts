import { Business } from '@appjusto/types';
import { useLoggedContextGetServerTime, useLoggedContextPlatformParams } from '../../LoggedContext';

export const useBusinessIsAcceptingOrders = (business: Business) => {
  const platformParams = useLoggedContextPlatformParams();
  const getServerTime = useLoggedContextGetServerTime();
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
