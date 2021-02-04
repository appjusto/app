import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../../../app/context';

export const useBusinessCoverImageURI = (businessId?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['business', 'cover', businessId], () =>
    businessId ? api.business().fetchBusinessCoverImageURI(businessId) : Promise.resolve(null)
  );
};
