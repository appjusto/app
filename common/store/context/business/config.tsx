import { CategoryWithProducts } from 'appjusto-types';
import React from 'react';
import { useMenuConfig } from '../../api/business/hooks/config';
import { getOrderedMenu } from '../../api/business/menu';
import { useContextCategories } from './categories';
import { useContextProducts } from './products';

interface Value {
  menu?: CategoryWithProducts[];
}

const MenuConfigContext = React.createContext<Value>({});

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}

export const MenuConfigProvider = ({ businessId, children }: Props) => {
  // context
  const categories = useContextCategories();
  const products = useContextProducts();
  // state
  const config = useMenuConfig(businessId);
  // result
  const menu = getOrderedMenu(categories, products, config);
  const value: Value = { menu };
  return <MenuConfigContext.Provider value={value}>{children}</MenuConfigContext.Provider>;
};

export const useContextMenu = () => {
  const value = React.useContext(MenuConfigContext);
  return value.menu;
};
