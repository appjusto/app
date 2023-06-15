import { PayableWith } from '@appjusto/types';
import { useSelector } from 'react-redux';
import { usePlatformParamsContext } from '../../../../contexts/PlatformParamsContext';
import { getConsumer } from '../../../consumer/selectors';
import { useContextActiveOrder } from '../../../context/order';
import { useObserveBusiness } from '../../business/hooks/useObserveBusiness';

export const useAcceptedPaymentMethods = (): PayableWith[] => {
  const acceptedPaymentMethods = usePlatformParamsContext()?.acceptedPaymentMethods ?? [];
  const order = useContextActiveOrder();
  const business = useObserveBusiness(order?.business?.id);
  const consumer = useSelector(getConsumer)!;
  if (!order) {
    return acceptedPaymentMethods;
  }
  if (!business) {
    return acceptedPaymentMethods.filter(
      (value) => value !== 'vr-alimentação' && value !== 'vr-refeição'
    );
  }
  if (consumer.tags?.includes('staff')) {
    return ['credit_card', 'pix', 'vr-alimentação', 'vr-refeição', 'credits'];
  }
  return (business.acceptedPaymentMethods ?? []).filter((mode) =>
    acceptedPaymentMethods.includes(mode)
  );
};
