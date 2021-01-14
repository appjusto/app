import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../assets/icons';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { borders, padding, screens } from '../../../common/styles';
import FilterButton from './components/FilterButton';
import { RestaurantsNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  // const api = useContext(ApiContext);
  // const dispatch = useDispatch<AppDispatch>();

  // refs
  const searchInputRef = useRef<TextInput>();

  //state
  const [searchText, setSearchText] = useState<string>('');

  // handlers
  // fires whenever use change the input text
  const textChangeHandler = useCallback(
    (text) => {
      setSearchText(text); // update source text
    },
    [searchText]
  );

  //UI
  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ paddingHorizontal: 12, marginTop: padding }}>
        <DefaultInput
          ref={searchInputRef}
          defaultValue={searchText}
          value={searchText}
          onChangeText={textChangeHandler}
          autoCorrect={false}
          style={{ paddingVertical: padding, paddingLeft: 12 }}
        />
        <View
          style={{
            ...borders.default,
            position: 'absolute',
            right: 24,
            bottom: padding,
            flex: 1,
          }}
        >
          <TouchableOpacity onPress={() => null}>
            <Image source={icons.search} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginHorizontal: 12, marginTop: padding }}>
        <FilterButton onPress={() => navigation.navigate('OrderBy')} />
      </View>
    </ScrollView>
  );
}
