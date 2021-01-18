import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../assets/icons';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { padding, screens } from '../../../common/styles';
import FilterButton from './components/FilterButton';
import RestaurantListItem from './components/RestaurantListItem';
import SingleHeader from './SingleHeader';
import { RestaurantsNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  //state
  const [searchText, setSearchText] = useState<string>('');
  const [searchData, setSearchData] = useState<RestaurantListItem[]>();
  const [resultCount, setResultCount] = useState<number>(0);

  type RestaurantListItem = {
    onPress: () => void;
    name: string;
    cuisine: string;
    deliveryRange: number;
    id: string;
  };

  const data: RestaurantListItem[] = [
    {
      onPress: () => null,
      name: 'Assis, o rei da Picanha',
      cuisine: 'Churrasco',
      deliveryRange: 4,
      id: '0',
    },
    {
      onPress: () => null,
      name: 'Disk Pizza',
      cuisine: 'Pizzaria',
      deliveryRange: 5,
      id: '1',
    },
    {
      onPress: () => null,
      name: 'Picanha da Aldeota',
      cuisine: 'Churrasco',
      deliveryRange: 6,
      id: '2',
    },
  ];

  // handlers
  const [dataSource, setDataSource] = useState<RestaurantListItem[]>(data);
  const getSearchResults = (text: string) => {
    if (text) {
      const newData = dataSource.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : ''.toLowerCase();
        const textData = text.toLowerCase();
        return name.indexOf(textData) > -1;
      });
      setSearchData(newData);
      setResultCount(newData.length);
    }
  };

  //UI
  return (
    <View style={{ ...screens.default }}>
      <PaddedView>
        <DefaultInput
          defaultValue={searchText}
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          style={{ paddingVertical: padding, paddingLeft: 12 }}
        />
        <View
          style={{
            position: 'absolute',
            right: 24,
            bottom: padding * 2,
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              getSearchResults(searchText);
              // console.log(searchData);
            }}
          >
            <Image source={icons.search} />
          </TouchableOpacity>
        </View>
      </PaddedView>
      <View style={{ marginBottom: padding }}>
        <FilterButton onPress={() => navigation.navigate('OrderBy')} />
      </View>

      {searchData && (
        <FlatList
          data={searchData}
          ListHeaderComponent={
            searchData ? <SingleHeader title={`${resultCount} resultados encontrados`} /> : null
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <RestaurantListItem
                onPress={item.onPress}
                cuisine={item.cuisine}
                name={item.name}
                deliveryRange={item.deliveryRange}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}
