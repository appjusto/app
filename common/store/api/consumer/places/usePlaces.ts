import { Place } from '@appjusto/types';
import React from 'react';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../app/context';
import { getUser } from '../../../user/selectors';

export const usePlaces = () => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser);
  // state
  const [places, setPlaces] = React.useState<Place[]>();
  // side effects
  React.useEffect(() => {
    if (!user) return;
    return api.consumer().observePlaces(user.uid, setPlaces);
  }, [api, user]);

  return places;
};
