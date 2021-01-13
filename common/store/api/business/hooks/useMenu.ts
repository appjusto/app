import { getOrderedMenu } from '../menu';
import { useCategories } from './categories';
import { useMenuConfig } from './config';
import { useProducts } from './products';

export const useMenu = (businessId: string) => {
  const categories = useCategories(businessId);
  const products = useProducts(businessId);
  const config = useMenuConfig(businessId);

  return getOrderedMenu(categories, products, config);
};
