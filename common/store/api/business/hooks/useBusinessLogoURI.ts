import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useBusinessLogoURI = (businessId?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['business', 'logo', businessId], () =>
    businessId ? api.business().fetchBusinessLogoURI(businessId) : Promise.resolve(null)
  );
};
