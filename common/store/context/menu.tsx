import { Category, Ordering, WithId } from '@appjusto/types';
import React from 'react';
import { useMenu } from '../api/business/hooks/useMenu';

interface Value {
  menu: WithId<Category>[] | undefined;
  ordering: Ordering | undefined;
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

export const useContextMenu = () => {
  return React.useContext(MenuContext)!.menu;
};

export const useContextMenuOrdering = () => {
  return React.useContext(MenuContext)!.ordering;
};
