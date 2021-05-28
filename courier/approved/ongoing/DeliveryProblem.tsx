import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconProblemCancel } from '../../../common/icons/icon-problem-cancel';
import { IconProblemChat } from '../../../common/icons/icon-problem-chat';
import { IconProblemPack } from '../../../common/icons/icon-problem-pack';
import { IconProblemUrgent } from '../../../common/icons/icon-problem-urgent';
import HomeCard from '../../../common/screens/home/cards/HomeCard';
import { padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'DeliveryProblem'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'DeliveryProblem'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const DeliveryProblem = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;

  // UI
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ marginBottom: padding }}
          onPress={() =>
            navigation.navigate('ReportIssue', {
              issueType: 'courier-refuse',
              orderId,
            })
          }
        >
          <HomeCard
            icon={<IconProblemCancel />}
            title={t('Desistir da entrega')}
            subtitle={t('Atenção: só é possível desistir até o momento da retirada')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginBottom: padding }}
          onPress={() =>
            navigation.navigate('ReportIssue', {
              issueType: 'courier-delivery-problem',
              orderId,
            })
          }
        >
          <HomeCard
            icon={<IconProblemPack />}
            title={t('Tive um problema com o pedido')}
            subtitle={t('Se você já estiver com o pedido em mãos e teve um problema')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginBottom: padding }}>
          <HomeCard
            icon={<IconProblemChat />}
            title={t('Preciso falar com o restaurante')}
            subtitle={t('Abrir chat direto com o restaurante')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <HomeCard
            icon={<IconProblemUrgent />}
            title={t('Estou com o problema urgente')}
            subtitle={t('O AppJusto vai ligar para você')}
          />
        </TouchableOpacity>
      </PaddedView>
    </ScrollView>
  );
};
