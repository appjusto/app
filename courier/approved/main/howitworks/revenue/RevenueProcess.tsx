import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { ApprovedParamList } from '../../../types';
import { HowAppJustoWorksParams } from '../types';
import { ImageRevenueProcess } from './image';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HowAppJustoWorksParams, 'RevenueProcess'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const RevenueProcess = ({ navigation }: Props) => {
  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
      <PaddedView>
        <Text
          style={{
            ...texts.x2l,
            marginBottom: halfPadding,
          }}
        >
          {t('Funcionamento do recebimento')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t(
            'No AppJusto, você faz uma corrida e 24 horas depois você tem o dinheiro disponível para saque.'
          )}
        </Text>
        <ImageRevenueProcess />
      </PaddedView>
    </ScrollView>
  );
};
