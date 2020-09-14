import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, ApiContext } from '../common/app/context';
import { getFlavor } from '../common/store/config/selectors';
import { getCourier } from '../common/store/courier/selectors';
import { observeProfile } from '../common/store/user/actions';
import { getUser } from '../common/store/user/selectors';
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
  const situation = courier?.situation;

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
