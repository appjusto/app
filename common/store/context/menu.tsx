import { Category } from 'appjusto-types';
import React from 'react';
import { useMenu } from '../api/business/hooks/useMenu';

const MenuContext = React.createContext<Category[] | undefined>(undefined);

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}

export const MenuProvider = ({ businessId, children }: Props) => {
  const menu = useMenu(businessId);
  return <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>;
};

export const useContextMenu = () => {
  return React.useContext(MenuContext);
};
