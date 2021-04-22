import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { t } from '../../../strings';
import DefaultButton from '../../components/buttons/DefaultButton';
import { IconShare } from '../../icons/icon-share';
import { borders, halfPadding, padding, screens, texts } from '../../styles';

export const Onboarding = () => {
  // estrututura:
  //icon: IconHangLoose, IconBeta, IconAppDelivery, IconHeartBox, IconShareBig
  //header
  //topDescription
  //bottomDescription
  // stepsDisplayer
  // buttonTitle
  const steps = [];
  for (let i = 1; i <= 2; i += 1) {
    steps.push(
      <View
        style={{
          height: halfPadding,
          width: halfPadding,
          ...borders.default,
          borderRadius: 4,
          backgroundColor: 'black',
          marginRight: halfPadding,
        }}
        key={`key-${i}`}
      />
    );
  }
  return (
    <ScrollView style={[screens.default, { paddingHorizontal: padding }]}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 48 }}>
        <IconShare />
        <Text style={{ ...texts.x2l, marginTop: 32, textAlign: 'center' }}>
          {t('Olá,\n boas vindas ao AppJusto!')}
        </Text>
        <Text style={{ ...texts.md, marginTop: 32, textAlign: 'center' }}>
          {t(
            'Mais que um app de delivery, somos um movimento por relações mais justas para clientes, restaurantes e entregadores.'
          )}
        </Text>
        <Text style={{ ...texts.md, marginTop: 32, textAlign: 'center' }}>
          {t(
            'O AppJusto veio para combater a precarização do trabalho e, com a ajuda de todos, vamos fazer dar certo!'
          )}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 32,
          flexDirection: 'row',
        }}
      >
        {steps}
      </View>
      <DefaultButton
        title={t('Avançar')}
        style={{ marginTop: 32, marginBottom: padding }}
        onPress={() => null}
      />
    </ScrollView>
  );
};
