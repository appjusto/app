import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import HorizontalSelect, {
  HorizontalSelectItem,
} from '../../../common/components/buttons/HorizontalSelect';
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
  // context
  const { orderId, fee } = route.params;

  // screen state
  const clientFeedbackData = [
    { title: t('Sim, tudo certo'), id: '1' },
    { title: t('Não, longa espera'), id: '2' },
    { title: t('Não, cliente não apareceu'), id: '3' },
  ];
  const [selectedClientFeedback, setSelectedClientFeedback] = useState<HorizontalSelectItem>();

  // UI
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
        <HorizontalSelect
          data={clientFeedbackData}
          selected={selectedClientFeedback}
          onSelect={setSelectedClientFeedback}
        />
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton title={t('Finalizar')} onPress={() => navigation.popToTop()} />
    </PaddedView>
  );
}
