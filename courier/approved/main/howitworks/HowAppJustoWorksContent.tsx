import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { AppJustoFreshdeskConsumerURL } from '../../../../strings/values';
import { ApprovedParamList } from '../../types';
import { IconApprovalProcess } from './approval/icon';
import { IconBlocks } from './blocks/icon';
import { IconFleets } from './fleets/icon';
import { IconFreshdesk } from './freshdesk/icon';
import { IconRevenue } from './revenue/icon';
import { IconSafety } from './safety/icon';
import { HowAppJustoWorksParams } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HowAppJustoWorksParams, 'HowAppJustoWorks'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const HowAppJustoWorksContent = ({ navigation }: Props) => {
  return (
    <PaddedView>
      <Text
        style={{
          ...texts.x2l,
          marginBottom: halfPadding,
        }}
      >
        {t('Entenda mais sobre o AppJusto')}
      </Text>
      <Text
        style={{
          ...texts.sm,
          color: colors.grey700,
          marginBottom: padding,
        }}
      >
        {t('Tire suas dúvidas e entenda os principais benefícios do AppJusto para o entregador')}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('ApprovalProcess')}
        style={{ marginBottom: halfPadding }}
      >
        <HomeCard
          icon={<IconApprovalProcess />}
          title={t('Aprovação de cadastro')}
          subtitle={t('Entenda como funciona o processo de aprovação de cadastro')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('RevenueProcess')}
        style={{ marginBottom: halfPadding }}
      >
        <HomeCard
          icon={<IconRevenue />}
          title={t('Recebimento')}
          subtitle={t('Entenda como funciona o fluxo de recebimento do AppJusto')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('FleetProcess')}
        style={{ marginBottom: halfPadding }}
      >
        <HomeCard
          icon={<IconFleets />}
          title={t('Frotas')}
          subtitle={t('Entenda nossa proposta para de autonomia no delivery')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('BlockProcess')}
        style={{ marginBottom: halfPadding }}
      >
        <HomeCard
          icon={<IconBlocks />}
          title={t('Bloqueios')}
          subtitle={t('Entenda como funciona o processo de bloqueios no AppJusto')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Safety')}
        style={{ marginBottom: halfPadding }}
      >
        <HomeCard
          icon={<IconSafety />}
          title={t('Segurança')}
          subtitle={t('Conheça as condições de segurança forncecidas pelo AppJusto')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(AppJustoFreshdeskConsumerURL);
        }}
        style={{ marginBottom: halfPadding }}
      >
        <HomeCard
          icon={<IconFreshdesk />}
          title={t('Ainda tem dúvidas?')}
          subtitle={t('Acesse a nossa base de conhecimento no Freshdesk')}
        />
      </TouchableOpacity>
    </PaddedView>
  );
};
