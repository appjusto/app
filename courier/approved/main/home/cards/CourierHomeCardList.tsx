import { ChatMessageUser, Order, WithId } from '@appjusto/types';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { IconFwCourier } from '../../../../../common/icons/icon-fw-courier';
import { IconShareGreen } from '../../../../../common/icons/icon-share-green';
import { IconSupport } from '../../../../../common/icons/icon-support';
import HomeCard from '../../../../../common/screens/home/cards/HomeCard';
import { HomeOngoingOrders } from '../../../../../common/screens/home/cards/HomeOngoingOrders';
import HomeShareCard from '../../../../../common/screens/home/cards/HomeShareCard';
import { halfPadding } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierDeliveriesSummary } from './CourierDeliveriesSummary';
import { CourierHomeRequests } from './CourierHomeRequests';

interface Props {
  onViewRequestsPress: () => void;
  onOngoingOrderPress: (order: WithId<Order>, chatFrom?: ChatMessageUser) => void;
  onDeliveriesSummaryPress: () => void;
  onHowItworksPress: () => void;
  onNeedSupportPress: () => void;
  onRecommendBusinessPress: () => void;
}

export const CourierHomeCardList = ({
  onViewRequestsPress,
  onOngoingOrderPress,
  onDeliveriesSummaryPress,
  onHowItworksPress,
  onNeedSupportPress,
  onRecommendBusinessPress,
}: Props) => {
  return (
    <PaddedView half>
      <CourierHomeRequests onPress={onViewRequestsPress} />
      <HomeOngoingOrders onPress={onOngoingOrderPress} />
      <CourierDeliveriesSummary onPress={onDeliveriesSummaryPress} />
      <TouchableOpacity onPress={onHowItworksPress} style={{ marginBottom: halfPadding }}>
        <HomeCard
          icon={<IconFwCourier />}
          title={t('Como funciona o AppJusto')}
          subtitle={t('Conheça as vantagens e entenda os benefícios que temos para você')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onNeedSupportPress} style={{ marginBottom: halfPadding }}>
        <HomeCard
          icon={<IconSupport />}
          title={t('Preciso de ajuda')}
          subtitle={t('Fale com nosso time ou faça uma denúncia')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRecommendBusinessPress} style={{ marginBottom: halfPadding }}>
        <HomeCard
          icon={<IconShareGreen />}
          title={t('Indique um restaurante')}
          subtitle={t('Conhece algum restaurante que ainda não está no AppJusto? Manda pra gente!')}
        />
      </TouchableOpacity>
      <HomeShareCard
        title="Divulgue o AppJusto"
        subtitle="Compartilhe esse movimento por uma economia mais justa."
      />
    </PaddedView>
  );
};
