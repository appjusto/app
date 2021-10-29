import { OrderType } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { IconIllustrationPizza } from '../../../../../common/icons/icon-illustration-pizza';
import { Lottie } from '../../../../../common/lottie';
import deliveryJson from '../../../../../common/lottie/icons-json/client.json';
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
        {t('Um delivery aberto, transparente e consciente.')}
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
          title={t('Encomendas')}
          subtitle={t('Peça para buscar ou entregar um pacote')}
          icon={
            <Lottie
              animationObject={deliveryJson}
              styleProp={{
                width: 100,
                height: 100,
              }}
            />
          }
          // icon={<IconSmallUser />}
          onPress={() => onStartOrderPress('p2p')}
        />
      </View>
    </PaddedView>
  );
};
