import React from 'react';
import { CategoriesProvider } from './categories';
import { MenuConfigProvider } from './config';
import { ProductsProvider } from './products';

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}

export const MenuProvider = ({ businessId, children }: Props) => {
  return (
    <CategoriesProvider businessId={businessId}>
      <ProductsProvider businessId={businessId}>
        <MenuConfigProvider businessId={businessId}>{children}</MenuConfigProvider>
      </ProductsProvider>
    </CategoriesProvider>
  );
};
