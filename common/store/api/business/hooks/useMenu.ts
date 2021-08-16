import { getParent, getSorted } from '../menu';
import { useCategories } from './useCategories';
import { useObserveMenuOrdering } from './useMenuConfig';
import { useObserveComplements } from './useObserveComplements';
import { useProducts } from './useProducts';

export const useMenu = (businessId: string) => {
  const categories = useCategories(businessId);
  const products = useProducts(businessId);
  const productsOrdering = useObserveMenuOrdering(businessId);
  const categoriesWithProducts = getSorted(categories, products, productsOrdering);
  const { complementsGroups, complements } = useObserveComplements(businessId);
  const complementsOrdering = useObserveMenuOrdering(businessId, 'complements');
  const groupsWithComplements = getSorted(complementsGroups, complements, complementsOrdering);
  return {
    categoriesWithProducts,
    groupsWithComplements,
    getProductCategory: (productId: string) => getParent(productsOrdering!, categories, productId),
    getComplementGroup: (complementId: string) =>
      getParent(complementsOrdering!, complementsGroups, complementId),
  };
};
