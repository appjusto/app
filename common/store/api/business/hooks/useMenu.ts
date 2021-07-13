import { getSorted } from '../menu';
import { useCategories } from './useCategories';
import { useObserveMenuOrdering } from './useMenuConfig';
import { useProducts } from './useProducts';

export const useMenu = (businessId: string) => {
  const categories = useCategories(businessId);
  const products = useProducts(businessId);
  const ordering = useObserveMenuOrdering(businessId);
  const menu = getSorted(categories, products, ordering);
  const getCategory = (productId: string) =>
    ordering
      ? categories.find(
          (category) =>
            category.id ===
            Object.entries(ordering.secondLevelIdsByFirstLevelId).find(([_, ids]) =>
              ids.includes(productId)
            )![0]
        )
      : undefined;
  return { menu, getCategory };
};
