import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../../common/styles/colors';
import { texts } from '../../../../common/styles/fonts';
import { ConsumerCarouselItem } from './ConsumerCarouselItem';
import { ConsumerCarouselLoginItem } from './ConsumerCarouselLoginItem';
import { AppJustoOnlyIcon } from './icons/AppJustoOnlyIcon';

interface Props {
  onLoginClick: () => void;
}

export const ConsumerCarousel = ({ onLoginClick }: Props) => {
  // UI
  return (
    <View style={{ flexDirection: 'row' }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* login */}
        <TouchableOpacity onPress={onLoginClick}>
          <ConsumerCarouselLoginItem />
        </TouchableOpacity>
        {/* selo de desconto */}
        <ConsumerCarouselItem
          icon={
            <View
              style={{
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: colors.green500,
              }}
            >
              <Text style={{ ...texts.x2s, ...texts.bold }}>%</Text>
            </View>
          }
        >
          <View>
            <Text style={{ ...texts.md, lineHeight: 22 }}>Selo "Preço Justo"</Text>
            <Text style={{ ...texts.md, color: colors.grey700, lineHeight: 22 }}>
              O valor é referente ao{' '}
              <Text style={{ fontFamily: 'BarlowBold' }}>
                desconto médio em relação a outros Apps
              </Text>
              . Pode comparar!
            </Text>
          </View>
        </ConsumerCarouselItem>
        {/* selo de só no appjusto */}
        <ConsumerCarouselItem icon={<AppJustoOnlyIcon />}>
          <View>
            <Text style={{ ...texts.md, lineHeight: 22 }}>Selo "Só no AppJusto"</Text>
            <Text style={{ ...texts.md, color: colors.grey700, lineHeight: 22 }}>
              Os restaurantes com esse selo optaram por fazer{' '}
              <Text style={{ fontFamily: 'BarlowBold', lineHeight: 22 }}>
                delivery apenas no AppJusto.
              </Text>
            </Text>
          </View>
        </ConsumerCarouselItem>
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
