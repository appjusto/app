import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { IconIuguLogo } from '../../../../common/icons/icon-iugu-logo';
import { IconIza } from '../../../../common/icons/icon-iza';
import HomeShareCard from '../../../../common/screens/home/cards/HomeShareCard';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { AppJustoIzaURL } from '../../../../strings/values';
import { CourierProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'PartnersAndDiscounts'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const PartnersAndDiscounts = ({ navigation }: Props) => {
  // tracking
  useSegmentScreen('PartnersAndDiscounts');
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
          <View style={{ paddingVertical: padding }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Atendimento médico e odontológico')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Exames, curativos e medicamentos')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Renda garantida em caso de afastamento')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Indenização em caso de invalidez')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('\u00B7 Seguro de vida')}</Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Auxílio funeral')}
            </Text>
          </View>
          <DefaultButton
            title={t('Quero meu desconto')}
            onPress={() => {
              track('opened Iza url');
              Linking.openURL(AppJustoIzaURL);
            }}
          />
        </PaddedView>
        <PaddedView
          style={{ ...borders.default, marginTop: halfPadding, backgroundColor: colors.white }}
        >
          <RoundedText>{t('Pagamentos')}</RoundedText>
          <View style={{ paddingTop: 24, paddingBottom: padding }}>
            <IconIuguLogo />
          </View>
          <Text style={{ ...texts.xs }}>
            {t(
              'Operador financeiro que faz o processamento e gestão das cobranças através da plataforma AppJusto. Veja as condições negociadas:'
            )}
          </Text>
          <View style={{ paddingTop: padding }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Subconta ativa: R$ 0,50/Mês*')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Cartão de crédito: 2,42% + R$ 0,09 por transação')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 Antecipação do recebimento: 2,75%**')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 PIX: 0,99% por transação')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 4 TEDs gratuitas por mês')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('\u00B7 TED adicional: R$ 2,00')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 24 }}>
              {t('* Somente se houver movimentação no mês;')}
            </Text>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('** % referente 30 dias, cobrada proporcional ao número de dias.')}
            </Text>
          </View>
        </PaddedView>
        <View style={{ paddingVertical: 24 }}>
          <Text style={{ ...texts.sm }}>
            {t(
              'E quanto mais a plataforma crescer, mais conseguiremos melhorar essas condições! Divulgue e ajude o AppJusto a crescer. Vai ser bom para você, vai ser bom para todos.'
            )}
          </Text>
        </View>
        <HomeShareCard
          title="Divulgue o AppJusto"
          subtitle="Compartilhe esse movimento por uma economia mais justa."
        />
      </PaddedView>
    </ScrollView>
  );
};
