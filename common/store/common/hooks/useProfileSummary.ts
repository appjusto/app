import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../app/context';
import { getFlavor } from '../../config/selectors';
import { getConsumer } from '../../consumer/selectors';
import { isConsumerProfileComplete } from '../../consumer/validators';
import { getCourier } from '../../courier/selectors';
import { getUser } from '../../user/selectors';

export const useProfileSummary = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const profile = flavor === 'consumer' ? consumer : courier;
  const { situation } = profile!;
  // state
  const [hasOrdered, setHasOrdered] = React.useState<boolean>();
  // side effects
  React.useEffect(() => {
    if (!profile?.id) return;
    api
      .order()
      .hasOrderedBefore(
        flavor === 'consumer' ? { consumerId: profile.id } : { courierId: profile.id }
      )
      .then(setHasOrdered);
  }, [api, flavor, profile?.id]);
  // result
  const profileComplete =
    flavor === 'consumer' ? isConsumerProfileComplete(consumer) : courier!.situation === 'approved';
  const phoneVerified = user?.phoneNumber === `+${profile?.countryCode ?? '55'}${profile?.phone}`;
  const shouldVerifyPhone = !phoneVerified && (flavor === 'courier' || !hasOrdered);
  const canUpdateProfile =
    flavor === 'consumer' ? !profileComplete || !hasOrdered : profile?.situation !== 'approved';
  return {
    situation,
    profileComplete,
    hasOrdered,
    phoneVerified,
    shouldVerifyPhone,
    canUpdateProfile,
  };
};
