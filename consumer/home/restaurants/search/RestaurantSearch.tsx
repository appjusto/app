import { StackNavigationProp } from '@react-navigation/stack';
import { Business, WithId } from 'appjusto-types';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { Image, TextInput, View } from 'react-native';
import * as icons from '../../../../assets/icons';
import { ApiContext } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import useLastKnownLocation from '../../../../common/hooks/useLastKnownLocation';
import { padding, screens } from '../../../../common/styles';
import { RestaurantsNavigatorParamList } from '../types';
import RestaurantList from './RestaurantList';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'RestaurantSearch'>;

type Props = {
  navigation: ScreenNavigationProp;
};

type SearchResult = {
  name: string;
  distance: number;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  // refs
  const searchInputRef = React.useRef<TextInput>();
  // state
  const { coords } = useLastKnownLocation();
  const [search, setSearch] = useState<string>('');
  const [restaurants, setRestaurants] = React.useState<WithId<Partial<Business>>[]>();
  // side effects
  // search
  const debouncedSearch = React.useCallback(
    debounce<(input: string) => void>(async (input) => {
      setRestaurants(await api.search().searchRestaurants(coords!, input));
    }, 500),
    [coords]
  );
  React.useEffect(() => {
    if (search.length === 0) return;
    if (!coords) return;
    debouncedSearch(search);
  }, [search, coords]);
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
      <RestaurantList
        items={restaurants}
        onSelect={(restaurantId) => navigation.navigate('RestaurantNavigator', { restaurantId })}
      />
    </View>
  );
}
