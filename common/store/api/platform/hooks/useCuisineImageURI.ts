import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useCuisineImageURI = (path?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['platform', 'cuisine', path], () =>
    path ? api.platform().fetchCuisineImageURI(path) : Promise.resolve(null)
  );
};
