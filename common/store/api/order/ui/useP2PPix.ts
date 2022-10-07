import { useSelector } from 'react-redux';
import { usePlatformParamsContext } from '../../../../contexts/PlatformParamsContext';
import { getConsumer } from '../../../consumer/selectors';

export const useP2PPix = () => {
  // context
  const platformParams = usePlatformParamsContext();
  // redux
  const consumer = useSelector(getConsumer)!;
  // result
  if (!platformParams) return false;
  const pixEnabledForAllUsers = platformParams.consumer.pixEnabled;
  return pixEnabledForAllUsers || consumer.tags?.includes('ui:pix');
};
