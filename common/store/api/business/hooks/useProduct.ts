import { Product, WithId } from '@appjusto/types';
import React from 'react';
import { ApiContext } from '../../../../app/context';
import { useContextGroupsWithComplements } from '../../../context/menu';

export const useProduct = (businessId: string, productId: string): WithId<Product> | undefined => {
  // context
  const api = React.useContext(ApiContext);
  const groupsWithComplements = useContextGroupsWithComplements();
  // state
  const [product, setProduct] = React.useState<WithId<Product>>();
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
    if (!product.complementsGroupsIds) return;
    if (!groupsWithComplements) return;
    setProductWithComplements({
      ...product,
      complementsGroups: groupsWithComplements.filter(({ id }) =>
        product.complementsGroupsIds?.includes(id)
      ),
    });
  }, [product, groupsWithComplements]);
  // result
  return productWithComplements ?? product;
};
