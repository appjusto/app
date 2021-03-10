import { OrderType } from 'appjusto-types';
import React from 'react';
import { Image, Text, View } from 'react-native';
import * as icons from '../../../../../assets/icons';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import ShowIf from '../../../../../common/components/views/ShowIf';
import useTallerDevice from '../../../../../common/hooks/useTallerDevice';
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
                paddingBottom: tallerDevice ? doublePadding : padding,
                marginTop: tallerDevice ? doublePadding : 0,
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
          icon={<Image source={icons.illustrationPizza} />}
          onPress={() => onStartOrderPress('food')}
        />
        <HomeControlItem
          title={t('Transporte de encomendas')}
          subtitle={t('Para buscar e deixar pacotes')}
          icon={<Image source={icons.consumerHomeIllustration} />}
          onPress={() => onStartOrderPress('p2p')}
        />
      </View>
    </PaddedView>
  );
};
