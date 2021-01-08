import { Product, WithId } from 'appjusto-types';
import React from 'react';
import { useProducts } from '../../api/business/hooks/products';

interface Value {
  products: WithId<Product>[];
  getProductById?: (productId: string) => WithId<Product> | undefined;
}

const ProductsContext = React.createContext<Value>({ products: [] });

interface Props {
  businessId: string;
  children: React.ReactNode | React.ReactNode[];
}
export const ProductsProvider = ({ businessId, children }: Props) => {
  const { products, getProductById } = useProducts(businessId);
  const value: Value = { products, getProductById };
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useContextProducts = () => {
  const value = React.useContext(ProductsContext);
  return value.products;
};

export const useContextGetProductById = () => {
  const value = React.useContext(ProductsContext);
  return value.getProductById;
};
