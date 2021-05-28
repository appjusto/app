import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconFwCourier } from '../../../common/icons/icon-fw-courier';
import HomeCard from '../../../common/screens/home/cards/HomeCard';
import { padding, screens } from '../../../common/styles';
import { t } from '../../../strings';

export const DeliveryProblem = () => {
  return (
    <ScrollView style={{ ...screens.config }} contentContainerStyle={{ flexGrow: 1 }}>
      <PaddedView style={{ flex: 1 }}>
        <Pressable style={{ marginBottom: padding }}>
          <HomeCard
            icon={<IconFwCourier />}
            title={t('Desistir da entrega')}
            subtitle={t('Atenção: só é possível desistir até o momento da retirada')}
          />
        </Pressable>
        <Pressable style={{ marginBottom: padding }}>
          <HomeCard
            icon={<IconFwCourier />}
            title={t('Tive um problema com o pedido')}
            subtitle={t('Se você já estiver com o pedido em mãos e teve um problema')}
          />
        </Pressable>
        <Pressable style={{ marginBottom: padding }}>
          <HomeCard
            icon={<IconFwCourier />}
            title={t('Preciso falar com o restaurante')}
            subtitle={t('Abrir chat direto com o restaurante')}
          />
        </Pressable>
        <Pressable>
          <HomeCard
            icon={<IconFwCourier />}
            title={t('Estou com o problema urgente')}
            subtitle={t('O AppJusto vai ligar para você')}
          />
        </Pressable>
      </PaddedView>
    </ScrollView>
  );
};
