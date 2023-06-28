import { WithId } from '@appjusto/types';
import React, { useContext } from 'react';
import { Complement } from '../../../../../../types';
import { ApiContext } from '../../../../app/context';

export const useProductComplementImageURI = (
  businessId: string,
  complement: WithId<Complement>
) => {
  const api = useContext(ApiContext);
  const [complementId, setComplementId] = React.useState<string>();
  const [complementURL, setComplementURL] = React.useState<string>();

  // side effects
  React.useEffect(() => {
    if (!complement) return;
    if (complement.imageUrls?.length) {
      setComplementURL(complement.imageUrls.find(() => true)!);
    } else {
      setComplementId(complement.id);
    }
  }, [complement]);
  React.useEffect(() => {
    if (!complementId) return;
    api
      .business()
      .getComplementImageStoragePath(businessId, complementId)
      .then((url) => {
        if (url) setComplementURL(url);
      });
  }, [api, businessId, complementId]);

  // result
  return complementURL;
};
