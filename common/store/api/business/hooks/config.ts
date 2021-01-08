import { MenuConfig } from 'appjusto-types';
import React from 'react';
import { ApiContext } from '../../../../app/context';

export const useMenuConfig = (businessId: string) => {
  // context
  const api = React.useContext(ApiContext);
  // state
  const [menuConfig, setMenuConfig] = React.useState<MenuConfig>();
  // side effects
  React.useEffect(() => {
    if (!businessId) return;
    return api.business().observeMenuConfig(businessId, setMenuConfig);
  }, [api, businessId]);
  // result
  return menuConfig;
};
