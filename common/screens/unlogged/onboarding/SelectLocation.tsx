import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { t } from '../../../../strings';
import DefaultInput from '../../../components/inputs/DefaultInput';
import { padding, screens } from '../../../styles';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'SelectLocation'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'SelectLocation'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const SelectLocation = ({ navigation, route }: Props) => {
  return (
    <SafeAreaView style={{ ...screens.lightGrey }}>
      <View>
        <DefaultInput
          title={t('Estado')}
          placeholder={t('Digite seu estado')}
          style={{ marginBottom: padding }}
        >
          {/* <Text>lista com os estados</Text> */}
        </DefaultInput>
        <DefaultInput
          title={t('Cidade')}
          placeholder={t('Digite sua cidade')}
          style={{ marginBottom: padding }}
        >
          {/* <Text>lista com as cidades do estado selecionado</Text> */}
        </DefaultInput>
      </View>
    </SafeAreaView>
  );
};
