import { Category, WithId } from 'appjusto-types';
import React from 'react';
import { useCategories } from '../../api/business/hooks/categories';

interface Value {
  categories: WithId<Category>[];
}

const CategoriesContext = React.createContext<Value>({ categories: [] });

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}
export const CategoriesProvider = ({ businessId, children }: Props) => {
  const categories = useCategories(businessId);
  const value: Value = { categories };
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};

export const useContextCategories = () => {
  const value = React.useContext(CategoriesContext);
  return value.categories;
};
