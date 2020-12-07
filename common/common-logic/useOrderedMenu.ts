// import { getOrderedMenu } from './functions';
import { Category, MenuConfig, Product, WithId } from 'appjusto-types';
import React from 'react';

import { ApiContext } from '../app/context';
import { useMenuConfig } from './useMenuConfig';
import { useObserveCategories } from './useObserveCategories';
import { useObserveProducts } from './useObserveProducts';

export const useOrderedMenu = (restaurantId: string | undefined) => {
  // context
  const api = React.useContext(ApiContext);
  const getOrderedMenu = (
    categories: WithId<Category>[],
    products: WithId<Product>[],
    config: MenuConfig
  ) => {
    if (categories.length === 0) return [];
    const { categoriesOrder, productsOrderByCategoryId } = config;
    return api
      .menu()
      .getOrderedCategories(categories, categoriesOrder)
      .map((category) => {
        return {
          ...category,
          products: api
            .menu()
            .getProductsByCategoryId(products, category.id, productsOrderByCategoryId),
        } as CategoryWithProducts;
      });
  };

  const categories = useObserveCategories(restaurantId);
  const products = useObserveProducts(restaurantId);
  const { menuConfig } = useMenuConfig(restaurantId);
  return getOrderedMenu(categories, products, menuConfig);
};
