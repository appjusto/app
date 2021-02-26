import { Classification, WithId } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useFoodClassifications = () => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [classifications, setClassifications] = React.useState<WithId<Classification>[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setClassifications(await api.platform().fetchFoodClassifications());
    })();
  }, [api]);
  // result
  return classifications;
};
