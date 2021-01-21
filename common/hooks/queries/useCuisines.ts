import { Cuisine } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../app/context';

export default function () {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [cuisines, setCuisines] = React.useState<Cuisine[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setCuisines(await api.order().fetchCuisines());
    })();
  }, []);
  return cuisines;
}
