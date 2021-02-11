import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Image, TextInput, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import { useSearchRestaurants } from '../../../../common/store/api/search/useSearchRestaurants';
import { getCurrentLocation } from '../../../../common/store/consumer/selectors';
import { padding, screens } from '../../../../common/styles';
import FilterSelector from '../components/filter/FilterSelector';
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
  // state
  const [search, setSearch] = useState<string>();
  const { restaurants } = useSearchRestaurants(currentLocation, search);
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
      <FilterSelector
        data={[{ title: 'Restaurants', id: 'restaurants' }]}
        onFilterChange={() => null}
        onFilter={() => null}
      />
      <RestaurantList
        items={restaurants}
        onSelect={(restaurantId) =>
          navigation.navigate('RestaurantNavigator', { restaurantId, screen: 'RestaurantDetail' })
        }
      />
    </View>
  );
}
