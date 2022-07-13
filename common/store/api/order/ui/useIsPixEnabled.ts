import { useSelector } from 'react-redux';
import { usePlatformParamsContext } from '../../../../contexts/PlatformParamsContext';
import { getConsumer } from '../../../consumer/selectors';
import { useContextBusiness } from '../../../context/business';

export const useIsPixEnabled = () => {
  // context
  const platformParams = usePlatformParamsContext();
  const business = useContextBusiness();
  // redux
  const consumer = useSelector(getConsumer)!;
  // result
  if (!platformParams || !business) return false;
  const businessAcceptsPix = business.acceptedPaymentMethods?.includes('pix');
  const pixEnabledForAllUsers = platformParams.consumer.pixEnabled;
  return businessAcceptsPix && (pixEnabledForAllUsers || consumer.tags?.includes('ui:pix'));
};
