import { BusinessProfile, CuisineName, WithDistance, WithId } from '@appjusto/types';
import { uniqBy } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getCurrentLocation } from '../../../consumer/selectors';
import { isBusinessOpen } from '../selectors';

export const useGeosearch = () => {
  // context
  const api = React.useContext(ApiContext);
  // const serverTime = useServerTime();
  // redux
  const currentLocation = useSelector(getCurrentLocation);
  // state
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [cuisine, setCuisine] = React.useState<CuisineName>();
  const [businesses, setBusinesses] = React.useState<WithDistance<WithId<BusinessProfile>>[]>([]);
  const [available, setAvailable] = React.useState<typeof businesses>([]);
  const [unavailable, setUnavailable] = React.useState<typeof businesses>([]);
  // callbacks
  const fetch = React.useCallback(async () => {
    if (!currentLocation) return;
    try {
      setLoading(true);
      setBusinesses(
        await api
          .businessesGeosearch()
          .fetchBusinessesAround({ location: currentLocation, page, cuisine })
      );
    } catch (error) {
      console.warn(error);
    }
    setLoading(false);
  }, [api, currentLocation, page, cuisine]);
  // effects
  React.useEffect(() => {
    fetch();
  }, [fetch]);
  React.useEffect(() => {
    setBusinesses([]);
  }, [currentLocation]);
  React.useEffect(() => {
    // const now = serverTime();
    const now = new Date();
    const tAvailable: typeof businesses = [];
    const tUnavailable: typeof businesses = [];
    businesses.forEach((b) => {
      const open = isBusinessOpen(b.schedules, now);
      if (
        b.status === 'available' &&
        b.deliveryRange &&
        b.deliveryRange / 1000 > b.distance &&
        ((open && b.preparationModes?.includes('realtime')) ||
          (!open && b.preparationModes?.includes('scheduled')))
      ) {
        tAvailable.push(b);
      } else {
        tUnavailable.push(b);
      }
    });
    setAvailable(uniqBy(tAvailable, (doc) => doc.id).sort((a, b) => a.distance - b.distance));
    setUnavailable(uniqBy(tUnavailable, (doc) => doc.id).sort((a, b) => a.distance - b.distance));
  }, [businesses]);
  // result
  const fetchNextPage = () => {
    if (!loading) setPage((current) => current + 1);
  };
  const refetch = async () => {
    setBusinesses([]);
    await fetch();
  };
  return { loading, available, unavailable, refetch, fetchNextPage, cuisine, setCuisine };
};
