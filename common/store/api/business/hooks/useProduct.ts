import { Complement, ComplementGroup, Product, WithId } from 'appjusto-types';
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
  // side effects
  // product
  React.useEffect(() => {
    return api.business().observeProduct(businessId, productId, setProduct);
  }, [api, businessId, productId]);
  // complement groups
  React.useEffect(() => {
    return api.business().observeProductComplementsGroups(businessId, productId, setGroups);
  }, [api, businessId, productId]);
  // complements
  React.useEffect(() => {
    return api.business().observeProductComplements(businessId, productId, setComplements);
  }, [api, businessId, productId]);
  // result
  if (!product || !product.complementsEnabled || !groups || !complements) return product;
  return {
    ...product,
    complementsGroups: getSorted(groups, complements, product.complementsOrder),
  };
};
