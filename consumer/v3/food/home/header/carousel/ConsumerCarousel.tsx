import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { colors } from '../../../../common/styles/colors';
import { texts } from '../../../../common/styles/fonts';
import { ConsumerCarouselItem } from './ConsumerCarouselItem';
import { ConsumerCarouselLoginItem } from './ConsumerCarouselLoginItem';

export const ConsumerCarousel = () => {
  // UI
  return (
    <View style={{ flexDirection: 'row' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ConsumerCarouselLoginItem />
        <ConsumerCarouselItem icon={<Text style={{ ...texts.md }}>🎉</Text>}>
          <View>
            <Text style={{ ...texts.md, lineHeight: 22 }}>Pratos mais baratos</Text>
            <Text style={{ ...texts.md, color: colors.grey700, lineHeight: 22 }}>
              Como restaurantes pagam menos eles podem ofertar{' '}
              <Text style={{ fontFamily: 'BarlowBold' }}>pratos com preços menores</Text>
            </Text>
          </View>
        </ConsumerCarouselItem>
        <ConsumerCarouselItem icon={<Text style={{ ...texts.md }}>🛵</Text>}>
          <Text style={{ ...texts.md, lineHeight: 22 }}>Entregadores ganham mais</Text>
          <Text
            style={{
              ...texts.md,
              color: colors.grey700,
              lineHeight: 22,
            }}
          >
            Entregadores definem suas próprias condições e{' '}
            <Text style={{ fontFamily: 'BarlowBold' }}>o valor da entrega fica todo para eles</Text>
          </Text>
        </ConsumerCarouselItem>
        <ConsumerCarouselItem icon={<Text style={{ ...texts.md }}>🍕</Text>}>
          <View>
            <Text style={{ ...texts.md, lineHeight: 22 }}>Restaurantes ganham mais</Text>
            <Text style={{ ...texts.md, color: colors.grey700, lineHeight: 22 }}>
              Nossa comissão é de 5%, enquanto{' '}
              <Text style={{ fontFamily: 'BarlowBold' }}>
                em outros apps esse valor pode chegar a quase 30%
              </Text>
            </Text>
          </View>
        </ConsumerCarouselItem>
        <ConsumerCarouselItem icon={<Text style={{ ...texts.md }}>📦</Text>}>
          <View>
            <Text style={{ ...texts.md }}>Entrega de encomendas</Text>
            <Text style={{ ...texts.md, color: colors.grey700, lineHeight: 22 }}>
              Nossa taxa de serviço é de R$ 5,00.{' '}
              <Text style={{ fontFamily: 'BarlowBold' }}>
                O valor da corrida depende da frota e vai todo para o entregador
              </Text>
            </Text>
          </View>
        </ConsumerCarouselItem>
      </ScrollView>
    </View>
  );
};
