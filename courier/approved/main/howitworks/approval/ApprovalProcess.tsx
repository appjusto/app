import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { ApprovedParamList } from '../../../types';
import { AlertBox } from '../common/AlertBox';
import { HowAppJustoWorksParams } from '../types';
import { ImageApprovalProcess } from './image';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HowAppJustoWorksParams, 'ApprovalProcess'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const ApprovalProcess = ({ navigation }: Props) => {
  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
      <PaddedView>
        <Text
          style={{
            ...texts.x2l,
            marginBottom: halfPadding,
          }}
        >
          {t('Funcionamento da aprovação de cadastro')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t(
            'Se você está cadastrado na cidade de São Paulo ou trabalha na cidade, faremos a aprovação toda sexta-feira ao longo do dia.'
          )}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t(
            'Para isso, você só precisa estar com a sua inscrição MEI em dia, e enviar todas as informações no cadastro.'
          )}
        </Text>
        <ImageApprovalProcess />
        <TouchableOpacity onPress={() => navigation.navigate('RecommendRestaurant')}>
          <AlertBox
            style={{ marginTop: padding }}
            title="Não está em São Paulo?"
            description="Não se preocupe, estamos em processo de expansão. Clique aqui para recomendar restaurantes
        da sua cidade para nos ajudar a chegar em outras cidades!"
          />
        </TouchableOpacity>
      </PaddedView>
    </ScrollView>
  );
};
