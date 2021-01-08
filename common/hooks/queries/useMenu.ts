import { Category, MenuConfig, Product, WithId } from 'appjusto-types';
import React, { useContext } from 'react';
import { ApiContext } from '../../app/context';

export default function (restaurantId: string) {
  const api = useContext(ApiContext);
  const [categories, setCategories] = React.useState<WithId<Category>[]>([]);
  const [products, setProducts] = React.useState<WithId<Product>[]>([]);
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>();

  // side effects
  // observe categories
  React.useEffect(() => {
    if (!restaurantId) return;
    return api.menu().observeCategories(restaurantId, setCategories);
  }, [api, restaurantId]);
  // observe products
  React.useEffect(() => {
    if (!restaurantId) return;
    return api.menu().observeProducts(restaurantId, setProducts);
  }, [api, restaurantId]);
  // observe menu config
  React.useEffect(() => {
    if (!restaurantId) return;
    return api.menu().observeMenuConfig(restaurantId, setMenuConfig);
  }, [api, restaurantId]);

  if (!menuConfig) return [];
  return api.menu().getOrderedMenu(categories, products, menuConfig);
}
