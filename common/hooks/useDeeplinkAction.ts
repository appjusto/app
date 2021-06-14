import * as Linking from 'expo-linking';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFlavor } from '../store/config/selectors';

export type DeeplinkScreen = 'restaurant-detail';
export interface DeeplinkAction {
  screen: DeeplinkScreen;
  params: Linking.QueryParams | null;
}

export const useDeeplinkAction = () => {
  // redux
  const flavor = useSelector(getFlavor);
  // state
  const deeplink = Linking.useUrl();
  const [action, setAction] = React.useState<DeeplinkAction>();
  // side effects
  React.useEffect(() => {
    if (!deeplink) return;

    const { path, queryParams } = Linking.parse(deeplink);
    if (path === 'consumer/r') {
      setAction({
        screen: 'restaurant-detail',
        params: queryParams,
      });
    }
  }, [deeplink, flavor]);
  return action;
};
