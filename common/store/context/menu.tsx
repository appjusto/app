import { Category, ComplementGroup, WithId } from '@appjusto/types';
import React from 'react';
import { useMenu } from '../api/business/hooks/useMenu';

interface Value {
  categoriesWithProducts: WithId<Category>[] | undefined;
  groupsWithComplements: WithId<ComplementGroup>[] | undefined;
  getProductCategory: (productId: string) => WithId<Category> | undefined;
  getComplementGroup: (complementId: string) => WithId<ComplementGroup> | undefined;
}

const MenuContext = React.createContext<Value | undefined>(undefined);

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}

export const MenuProvider = ({ businessId, children }: Props) => {
  const value = useMenu(businessId);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useContextCategoriesWithProducts = () => {
  return React.useContext(MenuContext)!.categoriesWithProducts;
};

export const useContextGroupsWithComplements = () => {
  return React.useContext(MenuContext)!.groupsWithComplements;
};

export const useContextGetProductCategory = () => {
  return React.useContext(MenuContext)!.getProductCategory;
};

export const useContextGetComplementGroup = () => {
  return React.useContext(MenuContext)!.getComplementGroup;
};
