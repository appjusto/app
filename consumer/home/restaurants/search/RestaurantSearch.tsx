import { StackNavigationProp } from '@react-navigation/stack';
import { Business, WithId } from 'appjusto-types';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import * as icons from '../../../../assets/icons';
import { ApiContext } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import FilterButton from '../components/FilterButton';
import RestaurantListItem from '../components/RestaurantListItem';
import SingleHeader from '../SingleHeader';
import { RestaurantsNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'RestaurantSearch'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  //state
  const [search, setSearch] = useState<string>('');
  const [restaurants, setRestaurants] = React.useState<WithId<Business>[]>();

  // handlers
  React.useEffect(() => {
    if (search.length === 0) return;
    return api.business().observeBusinesses({ type: 'restaurant', search }, setRestaurants);
  }, [search]);

  //UI
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <DefaultInput
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
      <View style={{ marginBottom: padding }}>
        <FilterButton onPress={() => navigation.navigate('OrderBy')} />
      </View>

      {restaurants && (
        <FlatList
          data={restaurants}
          ListHeaderComponent={
            <SingleHeader title={`${restaurants.length} ${t('resultados encontrados')}`} />
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <RestaurantListItem restaurant={item} onPress={() => null} />
            </View>
          )}
        />
      )}
    </View>
  );
}
