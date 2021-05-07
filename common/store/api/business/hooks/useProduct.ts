import { Complement, ComplementGroup, Product, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';
import { getSorted } from '../menu';

export const useProduct = (businessId: string, productId: string): WithId<Product> | undefined => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
  const [groups, setGroups] = React.useState<WithId<ComplementGroup>[]>();
  const [complements, setComplements] = React.useState<WithId<Complement>[]>();
  const [productWithComplements, setProductWithComplements] = React.useState<WithId<Product>>();
  // side effects
  // product
  React.useEffect(() => {
    return api.business().observeProduct(businessId, productId, setProduct);
  }, [api, businessId, productId]);
  // complement groups
  React.useEffect(() => {
    if (!product) return;
    if (!product.complementsEnabled) return;
    return api.business().observeProductComplementsGroups(businessId, product.id, setGroups);
  }, [api, businessId, product]);
  // complements
  React.useEffect(() => {
    if (!product) return;
    if (!product.complementsEnabled) return;
    return api.business().observeProductComplements(businessId, product.id, setComplements);
  }, [api, businessId, product]);
  React.useEffect(() => {
    if (!product) return;
    if (!product.complementsEnabled) return;
    if (!groups) return;
    if (!complements) return;
    setProductWithComplements({
      ...product,
      complementsGroups: getSorted(groups, complements, product.complementsOrder),
    });
  }, [product, groups, complements]);
  // result
  return productWithComplements ?? product;
};
