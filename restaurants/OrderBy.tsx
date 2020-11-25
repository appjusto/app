import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { padding, screens } from '../common/styles';
import { HomeNavigatorParamList } from '../consumer/home/types';
import SingleHeader from './SingleHeader';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  return (
    <ScrollView style={{ ...screens.default }}>
      <View style={{ marginTop: padding }}>
        <SingleHeader title="Ordernar por" />
      </View>
    </ScrollView>
  );
}
