import { CityStatistics } from '@appjusto/types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useCityStatistics = (city: string) => {
  const api = useContext(ApiContext);
  const [cityStatistics, setCityStatistics] = React.useState<CityStatistics | null>();
  React.useEffect(() => {
    return api.platform().observeCityStatistics(city, setCityStatistics);
  }, [api, city]);
  return cityStatistics;
};
