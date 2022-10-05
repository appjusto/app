import { useSelector } from 'react-redux';
import { getManager } from '../../business/selectors';
import { getFlavor } from '../../config/selectors';
import { getConsumer } from '../../consumer/selectors';
import { getCourier } from '../../courier/selectors';

export const useProfile = () => {
  // redux
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const manager = useSelector(getManager);
  const profile = flavor === 'consumer' ? consumer! : flavor === 'business' ? manager! : courier!;
  // result
  return { flavor, profile };
};
