import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { IconIza } from '../../../../common/icons/icon-iza';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { CourierProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'PartnersAndDiscounts'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const PartnersAndDiscounts = ({ navigation }: Props) => {
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView>
        <Text style={{ ...texts.x2l }}>{t('Negociações coletivas')}</Text>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}>
          {t(
            'Estamos sempre em busca de novos parceiros e negociando as melhores condições para vocês. Não recebemos nenhuma comissão por isso, pois sabemos que juntos somos mais fortes!  '
          )}
        </Text>
        <PaddedView style={{ ...borders.default, marginTop: 24, backgroundColor: colors.white }}>
          <RoundedText>{t('Seguros')}</RoundedText>
          <View style={{ paddingTop: padding, paddingBottom: halfPadding }}>
            <IconIza />
          </View>
          <Text style={{ ...texts.xs }}>
            {t(
              '20% de desconto no seguro pessoal. Você conta com R$ 30 mil de proteção financeira para utilizar em caso de acidentes (qualquer acidente, e não só durante entregas, ok?).'
            )}
          </Text>
          <View style={{ paddingTop: padding }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Atendimento médico e odontológico')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Exames, curativos e medicamentos')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Renda garantida em caso de afastamento')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Indenização em caso de invalidez')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Seguro de vida')}</Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Auxílio funeral')}</Text>
          </View>
        </PaddedView>
      </PaddedView>
    </ScrollView>
  );
};
