import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { t } from '../../../../strings';
import { ApiContext } from '../../../app/context';
import { IconMotocycle } from '../../../icons/icon-motocycle';
import useLastKnownLocation from '../../../location/useLastKnownLocation';
import { getConsumer } from '../../../store/consumer/selectors';
import { colors } from '../../../styles';
import HomeCard from './HomeCard';

export const HomeCouriersNearbyCard = () => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation();
  // redux
  const consumer = useSelector(getConsumer);
  // state
  const { coords } = useLastKnownLocation();
  const [availableCouriers, setAvailableCouriers] = React.useState(0);
  // callbacks
  const fetchTotalCouriersNearby = React.useCallback(async () => {
    if (!coords) return;
    try {
      const { total } = await api.courier().fetchTotalCouriersNearby(coords);
      setAvailableCouriers(total);
    } catch (error) {
      console.log(
        `Error while calling api.courier().fetchTotalCouriersNearby(${coords.latitude},${coords.longitude})`
      );
      console.log(error);
      Sentry.Native.captureException(error);
    }
  }, [api, coords]);
  // side effects
  // initial fetch
  React.useEffect(() => {
    if (!consumer) return;
    fetchTotalCouriersNearby();
  }, [consumer, fetchTotalCouriersNearby]);
  // focus
  React.useEffect(() => {
    if (!consumer) return;
    navigation.addListener('focus', fetchTotalCouriersNearby);
    return () => navigation.removeListener('focus', fetchTotalCouriersNearby);
  });
  // UI
  if (!consumer) return null;
  return (
    <TouchableOpacity onPress={fetchTotalCouriersNearby}>
      <HomeCard
        icon={<IconMotocycle circleColor={colors.grey50} width={64} height={64} />}
        title={`${availableCouriers} ${t('pessoas disponíveis')}`}
        subtitle={t('para entregas até 15km')}
      />
    </TouchableOpacity>
  );
};
