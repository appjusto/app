import { BusinessAlgolia, ProductAlgolia } from '@appjusto/types';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import { ApiContext } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../../common/icons/icon-cone-yellow';
import { useSearch } from '../../../../common/store/api/search/useSearch';
import {
  getCurrentLocation,
  getSearchFilters,
  getSearchKind,
  getSearchOrder,
} from '../../../../common/store/consumer/selectors';
import { colors, padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { sectionsFromResults } from '../restaurant/list';
import { RestaurantList } from '../restaurant/list/RestaurantList';
import { ProductListItem } from '../restaurant/product/ProductListItem';
import { FoodOrderNavigatorParamList } from '../types';
import { FilterSelector } from './FilterSelector';

type ScreenNavigationProp = StackNavigationProp<FoodOrderNavigatorParamList, 'RestaurantSearch'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  // refs
  const searchInputRef = React.useRef<TextInput>();
  // redux store
  const currentLocation = useSelector(getCurrentLocation);
  // redux
  const kind = useSelector(getSearchKind);
  const order = useSelector(getSearchOrder);
  const filters = useSelector(getSearchFilters);
  // state
  const [search, setSearch] = React.useState<string>('');
  const [refreshing, setRefreshing] = React.useState(false);
  const {
    results: restaurants,
    refetch: refetchRestaurants,
    isLoading: loadingRestaurants,
  } = useSearch<BusinessAlgolia>(
    kind === 'restaurant',
    kind,
    order,
    filters,
    currentLocation,
    search
  );
  const {
    results: products,
    refetch: refetchProducts,
    isLoading: loadingProducts,
  } = useSearch<ProductAlgolia>(kind === 'product', kind, order, filters, currentLocation, search);
  // initial focus
  React.useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  // handlers
  const refreshRestaurants = async () => {
    setRefreshing(true);
    await api.search().clearCache();
    await refetchRestaurants();
    setRefreshing(false);
  };
  const refreshProducts = async () => {
    setRefreshing(true);
    await api.search().clearCache();
    await refetchProducts();
    setRefreshing(false);
  };

  //UI
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <DefaultInput
          style={{ paddingVertical: padding, paddingLeft: 12, borderColor: colors.black }}
          ref={searchInputRef}
          defaultValue={search}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
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
      <PaddedView vertical={false}>
        <FilterSelector onFilterOpen={() => navigation.navigate('FilterScreen')} />
      </PaddedView>
      {kind === 'restaurant' && (
        <RestaurantList
          sections={sectionsFromResults(restaurants)}
          onSelect={(restaurantId) =>
            navigation.navigate('RestaurantNavigator', { restaurantId, screen: 'RestaurantDetail' })
          }
          loading={loadingRestaurants}
          refreshing={refreshing}
          onRefresh={() => refreshRestaurants()}
        />
      )}
      {kind === 'product' && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.objectID}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('RestaurantNavigator', {
                  initial: false,
                  screen: 'ItemDetail',
                  restaurantId: item.business.id,
                  params: {
                    productId: item.objectID,
                  },
                });
              }}
            >
              <ProductListItem product={item} showRestaurantName />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            loadingProducts ? (
              <View style={{ ...screens.centered, marginTop: padding }}>
                <ActivityIndicator size="small" color={colors.green500} />
              </View>
            ) : (
              <FeedbackView
                description={t(
                  'Não encontramos nenhum resultado para a sua busca. Refaça a pesquisa ou utilize filtros diferentes.'
                )}
                icon={<IconConeYellow />}
              />
            )
          }
          refreshing={refreshing}
          onRefresh={() => refreshProducts()}
        />
      )}
    </View>
  );
}
