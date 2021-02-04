import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../../../app/context';

export const useCuisineImageURI = (path?: string) => {
  const api = useContext(ApiContext);
  return useQuery(['platform', 'cuisine', path], () =>
    path ? api.business().fetchCuisineImageURI(path) : Promise.resolve(null)
  );
};
