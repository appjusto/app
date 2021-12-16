import { DispatchingState } from '@appjusto/types';
import firebase from 'firebase';
import React from 'react';
import { ApiContext } from '../../../../app/context';
import { useContextGetSeverTime } from '../../../../contexts/ServerTimeContext';
export const useOrderDispatchingStateElapsedSeconds = (
  orderId: string,
  dispatchingState: DispatchingState
) => {
  // context
  const api = React.useContext(ApiContext);
  const getServerTime = useContextGetSeverTime();
  // state
  const [tick, setTick] = React.useState(0);
  const [timestamp, setTimestmap] = React.useState<Date>();
  const [elapsed, setElapsed] = React.useState<number>();
  // side effects
  // setting up interval to keep elapsed time updated
  React.useEffect(() => {
    const interval = setInterval(() => setTick((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  // observing dispatchingState
  React.useEffect(() => {
    return api
      .order()
      .observeOrderDispatchingStateTimestamp(orderId, dispatchingState, (change) => {
        if (change) {
          setTimestmap((change.timestamp as firebase.firestore.Timestamp).toDate());
        }
      });
  }, [api, orderId, dispatchingState]);
  // calculating elapsed time every tick or when timestamp changes
  React.useEffect(() => {
    if (!timestamp) return;
    const now = (getServerTime ? getServerTime() : new Date()).getTime();
    const diff = now - timestamp.getTime();
    setElapsed(diff / 1000);
  }, [tick, timestamp]);
  // result
  return elapsed;
};
