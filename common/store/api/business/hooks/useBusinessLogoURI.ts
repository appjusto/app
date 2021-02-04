import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../../../app/context';

export const useBusinessLogoURI = (businessId?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['business', 'logo', businessId], () =>
    businessId ? api.business().fetchBusinessCoverImageURI(businessId) : Promise.resolve(null)
  );
};
