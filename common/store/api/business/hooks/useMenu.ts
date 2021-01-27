import { getSorted } from '../menu';
import { useCategories } from './useCategories';
import { useObserveMenuOrdering } from './useMenuConfig';
import { useProducts } from './useProducts';

export const useMenu = (businessId: string) => {
  const categories = useCategories(businessId);
  const products = useProducts(businessId);
  const ordering = useObserveMenuOrdering(businessId);

  return getSorted(categories, products, ordering);
};
