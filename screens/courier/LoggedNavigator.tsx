import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { observeCourier } from '../../store/courier/actions';
import { getCourier } from '../../store/courier/selectors';
import { getUser } from '../../store/user/selectors';
import { AppDispatch, ApiContext } from '../app/context';
import ApprovedNavigator from './approved/ApprovedNavigator';
import PendingNavigator from './pending/PendingNavigator';

export default function () {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // state
  const user = useSelector(getUser);
  const courier = useSelector(getCourier);

  // side effects
  // subscribe for profile changes
  useEffect(() => {
    return dispatch(observeCourier(api)(user!.uid));
  }, []);

  // UI
  if (!courier) return null;
  if (courier.info?.situation === 'blocked') {
  } else if (courier.info?.situation === 'reject') {
  } else if (courier.info?.situation === 'submitted') {
  } else if (courier.info?.situation === 'approved') {
    return ApprovedNavigator();
  }
  return PendingNavigator();
}
