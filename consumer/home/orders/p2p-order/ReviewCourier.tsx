import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';

import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../../common/components/icons/RoundedProfileImg';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import HR from '../../../../common/components/views/HR';
import Pill from '../../../../common/components/views/Pill';
import { halfPadding, screens, texts, colors, padding, borders } from '../../../../common/styles';
import { t } from '../../../../strings';
import { HistoryParamList } from '../../../history/types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'ReviewCourier'>;
type ScreenRoute = RouteProp<HistoryParamList, 'ReviewCourier'>;

type Props = {
  route: ScreenRoute;
};

export default function ({ route }: Props) {
  //context
  const { courierId } = route.params;
  return (
    <View style={{ ...screens.default }}>
      <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <RoundedProfileImg />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ ...texts.medium, marginBottom: halfPadding }}>João Paulo</Text>
          <Text style={{ ...texts.small, color: colors.darkGrey }}>No appJusto desde</Text>
          <Text style={{ ...texts.small }}>Setembro, 2020</Text>
        </View>
      </PaddedView>
      <HR height={padding} />
      <PaddedView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pill />
          <Text style={{ ...texts.medium, ...texts.bold, marginLeft: 12 }}>
            {t('Como foi a sua experiência com o entregador?')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: padding,
            marginBottom: 24,
          }}
        >
          <View
            style={{
              height: 64,
              width: 64,
              ...borders.default,
              borderRadius: 32,
              borderColor: colors.green,
            }}
          />
          <View
            style={{
              height: 64,
              width: 64,
              ...borders.default,
              borderRadius: 32,
              borderColor: colors.green,
              marginLeft: padding,
            }}
          />
        </View>
        <Text style={{ ...texts.medium, color: colors.darkGrey, marginBottom: halfPadding }}>
          {t(
            'Se preferir, descreva a sua experiência para outros clientes. Sua avaliação será anônima.'
          )}
        </Text>
        <DefaultInput title={t('Escreva sua mensagem')} multiline />
        <View style={{ flex: 1 }} />
        <DefaultButton title={t('Enviar')} onPress={() => null} />
      </PaddedView>
    </View>
  );
}
