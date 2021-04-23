import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from '../../../strings';
import { ApiContext } from '../../app/context';
import DefaultButton from '../../components/buttons/DefaultButton';
import { IconAppDelivery } from '../../icons/icon-app-delivery';
import { IconBeta } from '../../icons/icon-beta';
import { IconHangLoose } from '../../icons/icon-hang-loose';
import { IconHeartBox } from '../../icons/icon-heart-box';
import { IconShareBig } from '../../icons/icon-share-big';
import { getFlavor } from '../../store/config/selectors';
import { getConsumer } from '../../store/consumer/selectors';
import { getCourier } from '../../store/courier/selectors';
import { borders, halfPadding, padding, screens, texts } from '../../styles';

export enum OnboardingSteps {
  Welcome = 0,
  WeAreBeta,
  ForDelivery,
  YouCanChoose,
  Share,
}

export const Onboarding = () => {
  // context
  const api = useContext(ApiContext);
  // redux store
  const flavor = useSelector(getFlavor);
  // state
  const [step, setStep] = React.useState(OnboardingSteps.Welcome);
  const courier = useSelector(getCourier)!;
  const consumer = useSelector(getConsumer)!;

  let headerTitle;
  let topDescription;
  let bottomDescription;
  let icon;
  let buttonTitle;
  // let stepDisplay;
  if (step === OnboardingSteps.Welcome) {
    if (flavor === 'courier') {
      headerTitle = t('Olá,\n que legal ver você aqui!');
      topDescription = t(
        'Mais que um App de entregas, agora você faz parte de um movimento por relações mais justas e pelo fim da precarização do trabalho.'
      );
      bottomDescription = t(
        'Estamos apenas começando. Com o comprometimento de todos, vamos dar certo. Ajude divulgando esse movimento!'
      );
      icon = <IconHangLoose />; // maybe we can take the icon out of here
      // stepDisplay
      buttonTitle = t('Avançar');
    } else {
      headerTitle = t('Olá,\n boas vindas ao AppJusto!');
      topDescription = t(
        'Mais que um App de delivery, somos um movimento por relações mais justas para clientes, restaurantes e entregadores.'
      );
      bottomDescription = t(
        'O AppJusto veio para combater a precarização do trabalho e, com a ajuda de todos, vamos fazer dar certo!'
      );
      icon = <IconHangLoose />;
      // stepDisplay
      buttonTitle = t('Avançar');
    }
  }
  if (step === OnboardingSteps.WeAreBeta) {
    if (flavor === 'courier') {
      headerTitle = t('O AppJusto ainda está em fase de testes');
      topDescription = t(
        'Por enquanto, estamos em fase de validação e testes da plataforma. Queremos construir o melhor serviço pra você.'
      );
      bottomDescription = t(
        'Fique à vontade para nos avisar pelo chat se perceber algum problema e também para contribuir com sugestões. Vamos juntos!'
      );
      icon = <IconBeta />;
      // stepDisplay
      buttonTitle = t('Iniciar cadastro');
    } else {
      headerTitle = t('O AppJusto ainda está em fase de testes');
      topDescription = t(
        'Por enquanto, estamos em fase de validação e testes da plataforma. Queremos construir o melhor serviço pra você.'
      );
      bottomDescription = t(
        'Imprevistos podem ocorrer nesse início. VoCê pode nos avisar pelo chat e também contribuir com sugestões. Vamos construir juntos!'
      );
      icon = <IconBeta />;
      // stepDisplay
      buttonTitle = t('Avançar');
    }
  }
  if (step === OnboardingSteps.ForDelivery) {
    headerTitle = t('Use para Delivery e Entrega de\n encomendas');
    topDescription = t(
      'No Delivery, transferimos o valor integral das entregas para o entregador e cobramos a menor comissão possível do resraunte. Tudo para você ter o melhor serviço e menor preço.'
    );
    bottomDescription = t(
      'Na entrega de encomendas, os entregadores recebem o valor da frota que você escolher.'
    );
    icon = <IconAppDelivery />;
    // stepDisplay
    buttonTitle = t('Avançar');
  }
  if (step === OnboardingSteps.YouCanChoose) {
    headerTitle = t('Escolha a frota que quiser!');
    topDescription = t(
      'O AppJusto permite que entregadores criem suas próprias frotas. Escolha por remuneração justa, causa social, emissão de CO2, tempo de entrega. Você pode escolher a frota que mais se identifica para a sua entrega!'
    );
    bottomDescription = t(
      'Elas são ordenadas por quantidade de entregadores ativos próximos a você.'
    );
    icon = <IconHeartBox />;
    // stepDisplay
    buttonTitle = t('Avançar');
  }
  if (step === OnboardingSteps.Share) {
    headerTitle = t('Use o AppJusto e indique para\n os seus amigos');
    topDescription = t('Quanto mais você usar e indicar, mais vocÊ ajuda o movimento a crescer!');
    bottomDescription = t(
      'Além de tornar as relações mais justas na sua região, você ainda ajuda a melhorar a qualidade do serviço para entregadores e restaurantes.'
    );
    icon = <IconShareBig />;
    // stepDisplay
    buttonTitle = t('Começar');
  }
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

  // // handler
  const advanceHandler = async () => {
    if (flavor === 'courier' && step === OnboardingSteps.WeAreBeta) {
      api.profile().updateProfile(courier.id, { onBoarded: true });
      // navigation.navigate('screen')
    }
    if (flavor === 'consumer' && step === OnboardingSteps.Share) {
      api.profile().updateProfile(consumer.id, { onBoarded: true });
      // navigation.navigate('screen')
    } else {
      setStep(step + 1);
    }
  };

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
