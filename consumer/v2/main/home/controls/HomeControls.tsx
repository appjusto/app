import { OrderType } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import ShowIf from '../../../../../common/components/views/ShowIf';
import useTallerDevice from '../../../../../common/hooks/useTallerDevice';
import { IconIllustrationPizza } from '../../../../../common/icons/icon-illustration-pizza';
import { IconSmallUser } from '../../../../../common/icons/icon-small-user';
import { colors, doublePadding, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { HomeControlItem } from './HomeControlItem';

type Props = {
  onStartOrderPress: (type: OrderType) => void;
};

export const HomeControls = ({ onStartOrderPress }: Props) => {
  // context
  const tallerDevice = useTallerDevice();

  return (
    <PaddedView style={{ backgroundColor: colors.green500 }}>
      <ShowIf test={tallerDevice}>
        {() => (
          <Text
            style={[
              texts.x2l,
              {
                paddingBottom: padding,
              },
            ]}
          >
            {t('Somos um delivery aberto, transparente e consciente.')}
          </Text>
        )}
      </ShowIf>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: tallerDevice ? doublePadding : halfPadding,
        }}
      >
        <HomeControlItem
          title={t('Restaurantes e alimentação')}
          subtitle={t('Peça comida de uma forma justa')}
          icon={<IconIllustrationPizza />}
          onPress={() => onStartOrderPress('food')}
        />
        <HomeControlItem
          title={t('Encomendas')}
          subtitle={t('Peça para buscar ou entregar um pacote')}
          icon={<IconSmallUser />}
          onPress={() => onStartOrderPress('p2p')}
        />
      </View>
    </PaddedView>
  );
};
