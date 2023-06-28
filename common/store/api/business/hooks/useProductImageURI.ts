import { Product, ProductAlgolia, WithId } from '@appjusto/types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export const useProductImageURI = (
  businessId: string,
  product: WithId<Product> | ProductAlgolia | undefined,
  type: 'listing' | 'detail' = 'listing'
) => {
  const api = useContext(ApiContext);
  const [productId, setProductId] = React.useState<string>();
  const [productURL, setProductURL] = React.useState<string>();

  // side effects
  React.useEffect(() => {
    if (!product) return;
    if ('imageUrls' in product && product.imageUrls?.length) {
      setProductURL(product.imageUrls.find(() => true)!);
    } else if ('id' in product) {
      setProductId(product.id);
    } else {
      setProductId(product.objectID);
    }
  }, [product]);
  React.useEffect(() => {
    if (!productId) return;
    const size = type === 'listing' ? '288x288' : '1008x720';
    api
      .business()
      .getProductImageStoragePath(businessId, productId, size)
      .then((url) => {
        if (url) setProductURL(url);
      });
  }, [api, businessId, productId, type]);
  // result
  return productURL;
};
