import { PayableWith } from '@appjusto/types';
import { useContextGetSeverTime } from '../../../../../common/contexts/ServerTimeContext';
import { useObserveBusiness } from '../../../../../common/store/api/business/hooks/useObserveBusiness';
import { isAvailable } from '../../../../../common/store/api/business/selectors';
import { useAcceptedPaymentMethods } from '../../../../../common/store/api/platform/hooks/useAcceptedPaymentMethods';
import { useProfileSummary } from '../../../../../common/store/api/profile/useProfileSummary';
import { useContextActiveOrder } from '../../../../../common/store/context/order';

type CheckoutIssue =
  | 'profile-incomplete'
  | 'should-verify-phone'
  | 'invalid-payment-method'
  | 'unsupported-payment-method'
  | 'invalid-route'
  | 'business-closed'
  | 'schedule-unsupported'
  | 'schedule-required';

export const useCheckoutIssues = (selectedPaymentMethod: PayableWith, cardId?: string | null) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const now = getServerTime();
  const order = useContextActiveOrder();
  // state
  const acceptedPaymentMethods = useAcceptedPaymentMethods();
  const business = useObserveBusiness(order?.business?.id);
  const { isProfileComplete, shouldVerifyPhone } = useProfileSummary();
  // result
  const issues: CheckoutIssue[] = [];
  if (!isProfileComplete) {
    issues.push('profile-incomplete');
  }
  if (shouldVerifyPhone) {
    issues.push('should-verify-phone');
  }
  if (selectedPaymentMethod !== 'pix' && !cardId) {
    issues.push('invalid-payment-method');
  }
  if (!acceptedPaymentMethods.includes(selectedPaymentMethod)) {
    console.log('acceptedPaymentMethods', acceptedPaymentMethods, selectedPaymentMethod);
    issues.push('unsupported-payment-method');
  }
  if (order?.route?.issue) {
    issues.push('invalid-route');
  }
  if (business && !isAvailable(business.schedules, now)) {
    if (!business.preparationModes?.includes('scheduled')) {
      issues.push('business-closed');
    } else {
      if (!order?.scheduledTo) {
        issues.push('schedule-required');
      }
    }
  }
  return issues;
};
