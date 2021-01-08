import {
  Category,
  CategoryWithProducts,
  MenuConfig,
  Product,
  ProductsByCategory,
  WithId,
} from 'appjusto-types';

export const getOrderedMenu = (
  categories: WithId<Category>[],
  products: WithId<Product>[],
  config: MenuConfig | undefined
) => {
  if (!config || categories.length === 0) return [];
  const { categoriesOrder, productsOrderByCategoryId } = config;
  return getOrderedCategories(categories, categoriesOrder).map((category) => {
    return {
      ...category,
      products: getProductsByCategoryId(products, category.id, productsOrderByCategoryId),
    } as CategoryWithProducts;
  });
};

const getOrderedCategories = (
  categories: WithId<Category>[],
  order: string[]
): WithId<Category>[] => {
  return categories.sort((a, b) =>
    order.indexOf(a.id) === -1
      ? 1 // new categories go to the end by the default
      : order.indexOf(a.id) - order.indexOf(b.id)
  );
};

const getProductsByCategoryId = (
  products: WithId<Product>[],
  categoryId: string,
  productsOrderByCategoryId: ProductsByCategory
) => {
  const productsOrder = productsOrderByCategoryId[categoryId];
  if (!productsOrder) return [];
  return products
    .filter((product) => productsOrder.indexOf(product.id) !== -1) // only in this category
    .sort((a, b) => productsOrder.indexOf(a.id) - productsOrder.indexOf(b.id));
};
