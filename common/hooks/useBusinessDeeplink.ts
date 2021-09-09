import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import React from 'react';
import { ApiContext } from '../app/context';

export const useBusinessDeeplink = () => {
  // context
  const api = React.useContext(ApiContext);
  const navigation = useNavigation();
  // side effects
  const deeplink = Linking.useURL();
  React.useEffect(() => {
    if (!deeplink) return;
    const parsedURL = Linking.parse(deeplink);
    if (!parsedURL?.path) return;
    const r = /r\/([-a-zA-Z0-9]+)/.exec(parsedURL.path);
    if (!r) return;
    const [_, value] = r;
    api
      .business()
      .fetchBusiness(value)
      .then((business) => {
        if (business) {
          navigation.navigate('FoodOrderNavigator', {
            screen: 'RestaurantNavigator',
            params: {
              restaurantId: business.id,
              screen: 'RestaurantDetail',
            },
          });
        }
      });
  }, [deeplink, api, navigation]);
};
