import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { greenCheck } from '../../assets/icons';
import { ApiContext } from '../../common/app/context';
import HR from '../../common/components/views/HR';
import { IconMotocycleBeta } from '../../common/icons/icon-motocycle-beta';
import HomeShareCard from '../../common/screens/home/cards/HomeShareCard';
import { SocialMediaCard } from '../../common/screens/home/cards/SocialMediaCard';
import { useSegmentScreen } from '../../common/store/api/track';
import { getCourier } from '../../common/store/courier/selectors';
import { colors, padding, screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'ProfileSubmitted'>;
type ScreenRouteProp = RouteProp<UnapprovedParamList, 'ProfileSubmitted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const courier = useSelector(getCourier)!;
  // side effects
  // tracking
  useSegmentScreen('Profile Submitted');
  // adapting to situation changes
  // React.useEffect(() => {
  //   if (courier.situation === 'submitted') {
  //     // api.courier().verifyProfile();
  //   } else if (courier.situation === 'pending') {
  //     setTimeout(() => {
  //       navigation.replace('ProfilePending');
  //     }, 100);
  //   } else if (courier.situation === 'rejected') {
  //     setTimeout(() => {
  //       navigation.replace('ProfileRejected');
  //     }, 100);
  //   }
  // }, [courier, navigation, api]);
  // UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ ...screens.config }}>
        <View
          style={{
            backgroundColor: colors.green500,
            paddingHorizontal: padding,
            paddingTop: 32,
          }}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <IconMotocycleBeta />
            <Text style={{ ...texts.x2l, marginTop: 32 }}>
              {t('Cadastro enviado para o\n período de testes!')}
            </Text>
            <Text style={{ ...texts.md, marginTop: 32 }}>
              {t(
                'Nós avisaremos assim que o período de testes começar para que você possa fazer as corridas. O início será nas próximas semanas. '
              )}
            </Text>
            <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
              {t('Enquanto isso, aproveite para conhecer mais sobre o AppJusto:')}
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              marginTop: 48,
              marginBottom: 32,
              flexDirection: 'row',
            }}
          >
            <Image source={greenCheck} />
            <Text style={{ ...texts.xl, marginLeft: padding }}>
              {t('Sobre o período de testes')}
            </Text>
          </View>
          <Text style={{ ...texts.md }}>
            {t(
              'O AppJusto não terá barreiras por região, então você poderá aceitar corridas em qualquer cidade do Brasil.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(
              'No início concentraremos nossos esforços para gerar pedidos na região central de São Paulo, e iremos expandir para os locais em que houverem mais cadastros.'
            )}
          </Text>
        </View>
        <HR color={colors.grey500} />
        <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              marginTop: 48,
              marginBottom: 32,
              flexDirection: 'row',
            }}
          >
            <Image source={greenCheck} />
            <Text style={{ ...texts.xl, marginLeft: padding }}>{t('Autonomia e preço justo')}</Text>
          </View>
          <Text style={{ ...texts.md }}>
            {t(
              'No AppJusto você pode definir o valor cobrado pelo seu serviço criando uma frota ou escolhendo aquela que é mais justa para você.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t(
              'Ao começar, você estará na frota AppJusto, em que sua remuneração será de R$ 10,00 até 5km e mais R$ 2,00 por km adicional. Você pode mudar para outra frota quando quiser!'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(
              'Aqui no AppJusto não ganhamos nada em cima das entregas: o cliente paga direto para você, apenas com a taxa financeira sendo descontada.'
            )}
          </Text>
        </View>
        <HR color={colors.grey500} />
        <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              marginTop: 48,
              marginBottom: 32,
              flexDirection: 'row',
            }}
          >
            <Image source={greenCheck} />
            <Text style={{ ...texts.xl, marginLeft: padding }}>{t('Transparência')}</Text>
          </View>
          <Text style={{ ...texts.md }}>
            {t(
              'Nas outras plataformas você recebe sem saber o que foi descontado. Aqui nós sempre vamos te informar de todas as cobranças. Quem tem maquininha sabe que toda transação digital tem taxa, e a nossa é uma das menores do mercado.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t(
              '\u25CF A taxa financeira é de 2,21% + R$ 0,09 por cartão de crédito ou 0,99% por Pix. Por exemplo: em uma corrida de R$ 10,00 recebida por cartão, você receberá R$ 9,68. Essa diferença não fica pra gente. É o custo da transação na instituição financeira'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t(
              '\u25CF Os pagamentos por cartão de crédito serão recebidos em 30 dias e os por Pix no mesmo dia'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t(
              '\u25CF Por causa dessa taxa menor e do recebimento rápido, vamos incentivar que os clientes paguem por Pix.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t('\u25CF Antecipações podem ser feitas com uma taxa de 2,5%.')}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(
              '\u25CF Para transferir para a sua conta o custo é de R$ 2,00. Em breve, teremos transferências grátis por Pix!'
            )}
          </Text>
        </View>
        <HR color={colors.grey500} />
        <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              marginTop: 48,
              marginBottom: 32,
              flexDirection: 'row',
            }}
          >
            <Image source={greenCheck} />
            <Text style={{ ...texts.xl, marginLeft: padding }}>
              {t('Sem suspensões e bloqueios automáticos')}
            </Text>
          </View>
          <Text style={{ ...texts.md }}>
            {t(
              'Como os problemas de uma entrega podem ser causados por muitas situações como acidentes, falta de informação cedida pelos clientes, ou fraudes, achamos que o bloqueio automático é injusto.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t(
              'Sempre haverá uma pessoa real apurando os fatos antes que qualquer medida seja tomada.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(
              'No AppJusto também não temos score: você trabalha da maneira que achar adequada e recebe os pedidos que te beneficiarem.'
            )}
          </Text>
        </View>
        <HR color={colors.grey500} />
        <View style={{ marginHorizontal: padding }}>
          <View
            style={{
              marginTop: 48,
              marginBottom: 32,
              flexDirection: 'row',
            }}
          >
            <Image source={greenCheck} />
            <Text style={{ ...texts.xl, marginLeft: padding }}>
              {t('Fique sempre diponível para\n aceitar corridas e indique para todos')}
            </Text>
          </View>
          <Text style={{ ...texts.md }}>
            {t(
              'Quanto mais consumidores satisfeitos, mais pedidos. E mais você poderá receber o valor que é justo pelo seu trabalho.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t(
              'Para termos mais pedidos, contamos com os entregadores para receber os pedidos que tocarem e para divulgar a plataforma com outros entregadores.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(' Comece a divulgar agora mesmo!')}
          </Text>
        </View>
        <View style={{ marginBottom: 48, paddingHorizontal: padding }}>
          <HomeShareCard
            title="Divulgue o AppJusto"
            subtitle="Compartilhe esse movimento por uma economia mais justa."
          />
        </View>
        <HR color={colors.grey500} />
        <View style={{ marginHorizontal: padding }}>
          <View
            style={{
              marginTop: 48,
              marginBottom: 32,
              flexDirection: 'row',
            }}
          >
            <Image source={greenCheck} />
            <Text style={{ ...texts.xl, marginLeft: padding }}>
              {t('Atualize-se do movimento!')}
            </Text>
          </View>
          <Text style={{ ...texts.md, marginBottom: 48 }}>
            {t(
              'Siga o @appjusto nas redes sociais e participe da linha de transmissão no WhatsApp, enviando seu nome para o número +55 11 99177-3353.'
            )}
          </Text>
        </View>
        <View style={{ paddingHorizontal: padding }}>
          <SocialMediaCard app="instagram" />
          <View style={{ marginTop: padding }}>
            <SocialMediaCard app="whatsapp" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
