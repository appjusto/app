import { StackNavigationProp } from '@react-navigation/stack';
import { BusinessAlgolia, ProductAlgolia } from 'appjusto-types';
import React, { useState } from 'react';
import { FlatList, Image, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import { useSearch } from '../../../../common/store/api/search/useSearch';
import {
  getCurrentLocation,
  getSearchFilters,
  getSearchKind,
  getSearchOrder,
} from '../../../../common/store/consumer/selectors';
import { padding, screens } from '../../../../common/styles';
import FilterSelector from '../components/filter/FilterSelector';
import { ProductListItem } from '../restaurant/detail/ProductListItem';
import { RestaurantsNavigatorParamList } from '../types';
import RestaurantList from './RestaurantList';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'RestaurantSearch'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // refs
  const searchInputRef = React.useRef<TextInput>();
  // redux store
  const currentLocation = useSelector(getCurrentLocation);
  // redux
  const kind = useSelector(getSearchKind);
  const order = useSelector(getSearchOrder);
  const filters = useSelector(getSearchFilters);
  // state
  const [search, setSearch] = useState<string>('');
  const { results: restaurants } = useSearch<BusinessAlgolia>(
    kind === 'restaurant',
    kind,
    order,
    filters,
    currentLocation,
    search
  );
  const { results: products } = useSearch<ProductAlgolia>(
    kind === 'product',
    kind,
    order,
    filters,
    currentLocation,
    search
  );
  // initial focus
  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  //UI
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <DefaultInput
          ref={searchInputRef}
          defaultValue={search}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          style={{ paddingVertical: padding, paddingLeft: 12 }}
          autoCapitalize="none"
        />
        <View
          style={{
            position: 'absolute',
            right: 24,
            bottom: padding * 2,
            flex: 1,
          }}
        >
          <Image source={icons.search} />
        </View>
      </PaddedView>
      <FilterSelector onFilterOpen={() => null} />
      {kind === 'restaurant' && (
        <RestaurantList
          items={restaurants}
          onSelect={(restaurantId) =>
            navigation.navigate('RestaurantNavigator', { restaurantId, screen: 'RestaurantDetail' })
          }
        />
      )}
      {kind === 'product' && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.objectID}
          renderItem={({ item }) => <ProductListItem product={item} showRestaurantName />}
        />
      )}
    </View>
  );
}
