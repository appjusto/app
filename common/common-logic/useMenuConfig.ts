import { MenuConfig } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { useMutation } from 'react-query';

import { ApiContext } from '../app/context';

export const useMenuConfig = (restaurantId: string | undefined) => {
  const api = React.useContext(ApiContext);
  const empty = (): MenuConfig => ({ categoriesOrder: [], productsOrderByCategoryId: {} });
  //state
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>(empty());
  const [updateMenuConfig] = useMutation(async (menuConfig: MenuConfig) => {
    setMenuConfig(menuConfig); // optimistic update
    api.menu().updateMenuConfig(restaurantId!, menuConfig);
  });

  // side effects
  React.useEffect(() => {
    if (!restaurantId) return;
    return api.menu().observeMenuConfig(restaurantId, (config) => {
      // importar esse functions.empty
      setMenuConfig(!isEmpty(config) ? config : empty());
    });
  }, [api, restaurantId]);

  return { menuConfig, updateMenuConfig };
};
