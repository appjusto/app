import { Place } from '@appjusto/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { useSelector } from 'react-redux';
import { getConsumer, getCurrentPlace } from '../store/consumer/selectors';

export const useLastPlace = () => {
  // redux
  const currentPlace = useSelector(getCurrentPlace);
  const consumer = useSelector(getConsumer);
  const favoritePlaces = consumer?.favoritePlaces;
  // state
  const [lastPlace, setLastPlace] = React.useState<Place | null>(null);
  // side effects
  React.useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('lastPlace');
      if (stored) {
        // console.log('Usando place armazenado no storage...', JSON.stringify(JSON.parse(stored)));
        setLastPlace(JSON.parse(stored));
      } else {
        if (favoritePlaces && favoritePlaces.length > 0) {
          // console.log(
          //   'Usando o place do último pedido...',
          //   JSON.stringify(favoritePlaces?.find(() => true)!)
          // );
          setLastPlace(favoritePlaces?.find(() => true)!);
        }
      }
    })();
  }, [favoritePlaces]);
  React.useEffect(() => {
    (async () => {
      if (!currentPlace) return;
      // console.log('Salvando place no storage...', JSON.stringify(currentPlace));
      await AsyncStorage.setItem('lastPlace', JSON.stringify(currentPlace));
    })();
  }, [currentPlace]);
  return lastPlace;
};
