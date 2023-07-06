import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { Accordion } from '../../../../../common/components/views/accordion/Accordion';
import { biggerPadding, colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { ApprovedParamList } from '../../../types';
import { AlertBox } from '../common/AlertBox';
import { HowAppJustoWorksParams } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HowAppJustoWorksParams, 'BlockProcess'>,
  StackNavigationProp<ApprovedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const SafetyScreen = ({ navigation }: Props) => {
  // state
  const [selectedItemTitle, setSelectedItemTitle] = React.useState('');
  // UI
  return (
    <ScrollView scrollIndicatorInsets={{ right: 1 }}>
      <PaddedView>
        <Text
          style={{
            ...texts.x2l,
            marginBottom: halfPadding,
          }}
        >
          {t('Segurança em primeiro lugar')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: biggerPadding,
          }}
        >
          {t(
            'Reunimos aqui as principais informações sobre segurança para que você não deixe de se proteger.'
          )}
        </Text>
        {/* MEI */}
        <Text
          style={{
            ...texts.x2l,
            marginBottom: halfPadding,
          }}
        >
          {t('MEI - Microempreendedor individual')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: biggerPadding,
          }}
        >
          {t(
            'Microempreendedor Individual é um programa criado para ajudar profissionais autônomos a se formalizarem junto à Receita Federal e ao INSS.'
          )}
        </Text>
        <Accordion
          items={[
            {
              title: 'Qual é a importância do MEI?',
              body: [
                {
                  text: 'Profissionais com MEI regularizado têm acesso a direitos trabalhistas básicos, como auxílio acidente, auxílio maternidade, e aposentadoria.',
                },
              ],
            },
            {
              title: 'Por que o AppJusto exige MEI?',
              body: [
                {
                  text: 'O MEI é necessário para que a parceria entre entregador e AppJusto funcione corretamente.',
                },
                {
                  text: 'Os principais motivos são:\n \u00B7 Acesso aos direitos básicos do INSS;\n \u00B7 Combate à informalidade e a precarização do trabalho;\n \u00B7 Oferecer segurança jurídica entre a plataforma e os prestadores de serviços.',
                },
              ],
            },
            {
              title: 'Quanto custa manter o MEI?',
              body: [
                {
                  text: 'Para manter um MEI como entregador em 2023, o custo mensal é de R$71,00.',
                },
                {
                  text: 'Esse valor é reajustado anualmente pela Receita Federal.',
                },
              ],
            },
          ]}
          selectedItemTitle={selectedItemTitle}
          onSelectItem={(title) => {
            setSelectedItemTitle((current) => (title !== current ? title : ''));
          }}
        />
        <AlertBox
          style={{ marginTop: padding, marginBottom: biggerPadding }}
          title="Gerencie seu MEI sem intermediários"
          description="O Governo Federal oferece um site e também um aplicativo para orientar usuários sobre todos os detalhes do MEI."
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: halfPadding,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1 }}>
              <DefaultButton
                variant="grey"
                title="Site Quero ser MEI"
                onPress={() =>
                  Linking.openURL(
                    'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei/o-que-e-ser-um-mei'
                  )
                }
              />
            </View>
            <View style={{ flex: 1, marginLeft: padding }}>
              <DefaultButton
                variant="grey"
                title="Aplicativo MEI"
                onPress={() => {
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=br.gov.fazenda.receita.mei'
                  );
                }}
              />
            </View>
          </View>
        </AlertBox>
        {/* Seguro */}
        <Text
          style={{
            ...texts.x2l,
            marginBottom: 4,
          }}
        >
          {t('Seguro contra acidentes')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: halfPadding,
          }}
        >
          {t('Seguradora IZA S/A')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: biggerPadding,
          }}
        >
          {t(
            'O Seguro Acidentes IZA é uma proteção pessoal para garantir que você e sua família não fiquem desamparados em casos de acidentes de trânsito enquanto trabalha.'
          )}
        </Text>
        <Accordion
          style={{ marginBottom: biggerPadding }}
          items={[
            {
              title: 'Resumo do benefício',
              body: [
                {
                  text: ' \u00B7 Despesas Médicas e Hospitalares: até R$ 5 mil;\n \u00B7 Diária por Incapacidade Temporária: até R$ 60 por dia por até 20 dias;\n \u00B7 Indenização por Invalidez Total ou Parcial: até R$ 20 mil;\n \u00B7 Cobertura de Morte Acidental + Auxílio Funeral: Até R$ 20.000,00 + R$ 5.000,00 extras;',
                },
              ],
              children: (
                <View style={{ flexDirection: 'row', marginTop: padding }}>
                  <DefaultButton
                    title="   Saiba mais  "
                    onPress={() => {
                      Linking.openURL('https://seguro.iza.com.vc/plano_appjusto');
                    }}
                  />
                </View>
              ),
            },
            {
              title: 'Como me proteger',
              body: [
                {
                  text: 'A proteção é automática e está ativa em todas as corridas. Você só precisa estar com o cadastro ativo e ter preenchido sua data de nascimento.',
                },
                {
                  text: 'Baixe o aplicativo da Iza no seu celular e se registre. É por lá que você vai abrir uma ocorrência caso precise.',
                },
              ],
              children: (
                <View style={{ flexDirection: 'row', marginTop: padding }}>
                  <DefaultButton
                    title="   Baixar App  "
                    onPress={() => {
                      Linking.openURL(
                        'https://play.google.com/store/apps/details?id=vc.com.iza.izaapp'
                      );
                    }}
                  />
                </View>
              ),
            },
          ]}
          selectedItemTitle={selectedItemTitle}
          onSelectItem={(title) => {
            setSelectedItemTitle((current) => (title !== current ? title : ''));
          }}
        />
        {/* Cartilhas e cursos */}
        <Text
          style={{
            ...texts.x2l,
            marginBottom: biggerPadding,
          }}
        >
          {t('Cartilhas de segurança')}
        </Text>
        <Accordion
          items={[
            {
              title: 'Cartilhas de segurança',
              subtitle: 'Fundacentro e Detran/SP',
              body: [
                {
                  text: 'Indicamos a leitura destas cartilhas para ajudar na prevenção de acidentes no trânsito e incentivar uma pilotagem consciente. ',
                },
              ],
              children: (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: padding,
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <DefaultButton
                      title="Motoboy"
                      onPress={() =>
                        Linking.openURL(
                          'http://arquivosbiblioteca.fundacentro.gov.br/exlibris/aleph/a23_1/apache_media/749TS8QXRI4LV9AG4MIUTX22AP23MM.pdf'
                        )
                      }
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: padding }}>
                    <DefaultButton
                      title="Guia Motociclista"
                      onPress={() => {
                        Linking.openURL(
                          'https://escola.detran.rs.gov.br/wp-content/uploads/2020/10/CARTILHA-MOTOBOY-1.pdf'
                        );
                      }}
                    />
                  </View>
                </View>
              ),
            },
            {
              title: 'Curso Motofretista Seguro',
              subtitle: 'Detran/SP',
              body: [
                {
                  text: 'O curso de motofretista é uma exigência legal para motociclistas que querem trabalhar com o transporte de pequenas cargas.',
                },
              ],
              children: (
                <View style={{ flexDirection: 'row', marginTop: padding }}>
                  <DefaultButton
                    title="   Saiba mais  "
                    onPress={() => {
                      Linking.openURL('https://ead.detran.sp.gov.br/ept/bci/motofrete');
                    }}
                  />
                </View>
              ),
            },
          ]}
          selectedItemTitle={selectedItemTitle}
          onSelectItem={(title) => {
            setSelectedItemTitle((current) => (title !== current ? title : ''));
          }}
        />
      </PaddedView>
    </ScrollView>
  );
};
