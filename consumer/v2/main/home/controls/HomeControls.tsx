import { OrderType } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { IconIllustrationPizza } from '../../../../../common/icons/icon-illustration-pizza';
import { IconSmallUser } from '../../../../../common/icons/icon-small-user';
import { colors, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { HomeControlItem } from './HomeControlItem';

type Props = {
  onStartOrderPress: (type: OrderType) => void;
};

export const HomeControls = ({ onStartOrderPress }: Props) => {
  return (
    <PaddedView style={{ backgroundColor: colors.green500 }}>
      <Text
        style={[
          texts.x2l,
          {
            paddingBottom: padding,
            paddingTop: padding,
          },
        ]}
      >
        {t('Delivery e entregas com modelo sustentável.')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: padding,
        }}
      >
        <HomeControlItem
          title={t('Restaurantes')}
          subtitle={t('Peça comida de uma forma justa')}
          icon={<IconIllustrationPizza />}
          onPress={() => onStartOrderPress('food')}
        />
        <HomeControlItem
          title={t('Entregas Rápidas')}
          subtitle={t('Peça para buscar ou entregar um pacote')}
          icon={<IconSmallUser />}
          onPress={() => onStartOrderPress('p2p')}
        />
      </View>
    </PaddedView>
  );
};
