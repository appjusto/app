import { useSelector } from 'react-redux';
import { getFlavor } from '../../config/selectors';
import { getConsumer } from '../../consumer/selectors';
import { getCourier } from '../../courier/selectors';

export const useProfile = () => {
  // redux
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const profile = flavor === 'consumer' ? consumer! : courier!;
  // result
  return { flavor, profile };
};
