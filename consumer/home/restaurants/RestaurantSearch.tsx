import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import * as icons from '../../../assets/icons';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { padding, screens } from '../../../common/styles';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

export default function () {
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
        <Image source={icons.search} style={{ position: 'absolute', right: 24, bottom: padding }} />
      </View>
    </ScrollView>
  );
}
