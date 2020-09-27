import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { borders, colors, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'OrderCompleted'>;
type ScreenRoute = RouteProp<ApprovedParamList, 'OrderCompleted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  const { orderId, fee } = route.params;

  const clientFeedbackData = [
    { title: 'Sim, tudo certo', key: '1' },
    { title: 'Não, longa espera', key: '2' },
    { title: 'Não, cliente não apareceu', key: '3' },
  ];

  return (
    <PaddedView style={{ ...screens.default }}>
      <View style={{ paddingTop: 24, alignItems: 'center' }}>
        <Image source={icons.motocycle} />
        <Text style={{ ...texts.big, marginVertical: 16 }}>{t('Corrida finalizada!')}</Text>
        <Text style={{ ...texts.default, color: colors.darkGrey }}>{t('Valor recebido')}</Text>
        <Text style={{ ...texts.big, marginTop: 4 }}>{formatCurrency(fee)}</Text>
      </View>
      {/* <View style={{ marginTop: 24 }}>
        <Text style={{ ...texts.default, marginBottom: 16 }}>
          {t('Tudo certo no restaurante?')}
        </Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={dataOne}
          renderItem={({ item }) => (
            <TouchableOpacity key={item.key}>
              <View style={styles.feedbackBox}>
                <Text>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View> */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ ...texts.default, marginBottom: 16 }}>{t('Tudo certo no cliente?')}</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={clientFeedbackData}
          renderItem={({ item }) => (
            <TouchableOpacity key={item.key}>
              <View style={styles.feedbackBox}>
                <Text>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} />
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  feedbackBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    ...borders.default,
    borderRadius: 6,
    height: 40,
    marginRight: 4,
  },
});
