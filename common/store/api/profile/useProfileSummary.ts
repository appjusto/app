import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../app/context';
import { getFlavor } from '../../config/selectors';
import { getConsumer } from '../../consumer/selectors';
import { isConsumerProfileComplete } from '../../consumer/validators';
import { getCourier } from '../../courier/selectors';

export const useProfileSummary = () => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation();
  // redux
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const profile = flavor === 'consumer' ? consumer! : courier!;
  const { situation } = profile;
  // state
  const [hasOrdered, setHasOrdered] = React.useState<boolean | undefined>();
  const [isProfilePhoneVerified, setProfilePhoneVerified] = React.useState<boolean | undefined>();
  // helpers
  const update = () => {
    setProfilePhoneVerified(
      api.auth().getPhoneNumber() === `+${profile?.countryCode ?? '55'}${profile?.phone}`
    );
  };
  // side effects
  // check if has ordered before
  React.useEffect(() => {
    setHasOrdered(
      flavor === 'consumer'
        ? consumer!.statistics.totalOrders > 0
        : courier!.statistics.deliveries > 0
    );
  }, [api, flavor, consumer?.statistics?.totalOrders, courier?.statistics?.deliveries]);
  // updating when phone or countryCode changes
  React.useEffect(update, [api, profile.countryCode, profile.phone]);
  // updating whenever screen is focused
  React.useEffect(() => {
    navigation.addListener('focus', update);
    return () => navigation.removeListener('focus', update);
  }, [profile]);
  React.useEffect(() => {
    navigation.addListener('focus', update);
    return () => navigation.removeListener('focus', update);
  }, []);
  // result
  const isProfileComplete =
    situation === 'approved' && (flavor === 'courier' || isConsumerProfileComplete(consumer));
  const shouldVerifyPhone =
    isProfilePhoneVerified === false &&
    isProfileComplete &&
    (flavor === 'courier' || hasOrdered === false);
  const canUpdateProfile = !isProfileComplete || (flavor === 'consumer' && !hasOrdered);

  return {
    situation,
    hasOrdered,
    isProfilePhoneVerified,
    isProfileComplete,
    shouldVerifyPhone,
    canUpdateProfile,
  };
};
