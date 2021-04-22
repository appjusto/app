import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from '../../../strings';
import DefaultButton from '../../components/buttons/DefaultButton';
import { IconBeta } from '../../icons/icon-beta';
import { IconHangLoose } from '../../icons/icon-hang-loose';
import { getFlavor } from '../../store/config/selectors';
import { borders, halfPadding, padding, screens, texts } from '../../styles';

export enum OnboardingSteps {
  Welcome = 0,
  WeAreBeta,
  ForDelivery,
  YouCanChoose,
  Share,
}

export const Onboarding = () => {
  // redux store
  const flavor = useSelector(getFlavor);
  // state
  const [step, setStep] = React.useState(OnboardingSteps.Welcome);
  // estrututura:
  //icon: IconHangLoose, IconBeta, IconAppDelivery, IconHeartBox, IconShareBig
  //header
  let headerTitle;
  let topDescription;
  let bottomDescription;
  let icon;
  let buttonTitle;
  if (flavor === 'courier' && step === OnboardingSteps.Welcome) {
    headerTitle = t('Olá,\n que legal ver você aqui!');
    topDescription = t(
      'Mais que um App de entregas, agora você faz parte de um movimento por relações mais justas e pelo fim da precarização do trabalho.'
    );
    bottomDescription = t(
      'Estamos apenas começando. Com o comprometimento de todos, vamos dar certo. Ajude divulgando esse movimento!'
    );
    icon = <IconHangLoose />;
    // stepDisplay
    buttonTitle = t('Avançar');
  }
  if (flavor === 'courier' && step === OnboardingSteps.WeAreBeta) {
    headerTitle = t('O AppJusto ainda está em fase de testes');
    topDescription = t(
      'Por enquanto, estamos em fase de validação e testes da plataforma. Queremos construir o melhor serviço pra você.'
    );
    bottomDescription = t(
      'Fique à vontade para nos avisar pelo chat se perceber algum problema e também para contribuir com sugestões. Vamos juntos'
    );
    icon = <IconBeta />;
    // stepDisplay
    buttonTitle = t('Iniciar cadastro');
  }

  //topDescription
  //bottomDescription
  // stepsDisplayer
  // buttonTitle
  const steps = [];
  const totalSteps = flavor === 'courier' ? 2 : 5;

  for (let i = 1; i <= totalSteps; i += 1) {
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
        {icon}
        <Text style={{ ...texts.x2l, marginTop: 32, textAlign: 'center' }}>{headerTitle}</Text>
        <Text style={{ ...texts.md, marginTop: 32, textAlign: 'center' }}>{topDescription}</Text>
        <Text style={{ ...texts.md, marginTop: 32, textAlign: 'center' }}>{bottomDescription}</Text>
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
        title={buttonTitle ?? ''}
        style={{ marginTop: 32, marginBottom: padding }}
        onPress={() => setStep(step + 1)}
      />
    </ScrollView>
  );
};
