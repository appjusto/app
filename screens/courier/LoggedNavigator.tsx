import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getFlavor } from '../../store/config/selectors';
import { getCourier } from '../../store/courier/selectors';
import { observeProfile } from '../../store/user/actions';
import { getUser } from '../../store/user/selectors';
import { AppDispatch, ApiContext } from '../app/context';
import ApprovedNavigator from './approved/ApprovedNavigator';
import PendingNavigator from './pending/PendingNavigator';

export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // app state
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser);
  const courier = useSelector(getCourier);
  const situation = courier?.info?.situation;

  // side effects
  // subscribe for profile changes
  useEffect(() => {
    return dispatch(observeProfile(api)(flavor, user!.uid));
  }, []);

  // UI
  // TO-DO: add activity indicator while loading courier profile
  if (!situation) return null;

  if (situation === 'approved') {
    return <ApprovedNavigator />;
  }
  return <PendingNavigator />;
}
