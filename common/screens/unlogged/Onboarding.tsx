import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { t } from '../../../strings';
import DefaultButton from '../../components/buttons/DefaultButton';
import { IconMotocycle } from '../../icons/icon-motocycle';
import { colors, padding, screens, texts } from '../../styles';

export const Onboarding = () => {
  // estrututura:
  //icon
  //header
  //topDescription
  //bottomDescription
  // stepsDisplayer
  // buttonTitle
  return (
    <ScrollView style={[screens.default, { paddingHorizontal: padding }]}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 48 }}>
        <IconMotocycle circleColor={colors.white} />
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
      <DefaultButton
        title={t('Avançar')}
        style={{ marginTop: 32, marginBottom: padding }}
        onPress={() => null}
      />
    </ScrollView>
  );
};
