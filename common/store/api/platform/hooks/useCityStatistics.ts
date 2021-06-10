import { CityStatistics } from '@appjusto/types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useCityStatistics = (city?: string | undefined) => {
  const api = useContext(ApiContext);
  const [cityStatistics, setCityStatistics] = React.useState<CityStatistics | null>();
  React.useEffect(() => {
    if (!city) return;
    return api.platform().observeCityStatistics(city, setCityStatistics);
  }, [api, city]);
  return cityStatistics;
};
