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
import { IconMotocycle } from '../../common/icons/icon-motocycle';
import HomeShareCard from '../../common/screens/home/cards/HomeShareCard';
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
  React.useEffect(() => {
    if (courier.situation === 'submitted') {
      // api.courier().verifyProfile();
    } else if (courier.situation === 'pending') {
      setTimeout(() => {
        navigation.replace('ProfilePending');
      }, 100);
    } else if (courier.situation === 'rejected') {
      setTimeout(() => {
        navigation.replace('ProfileRejected');
      }, 100);
    }
  }, [courier, navigation, api]);
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
            <IconMotocycle circleColor={colors.white} />
            <Text style={{ ...texts.x2l, marginTop: 32 }}>{t('Cadastro enviado!')}</Text>
            <Text style={{ ...texts.md, marginTop: 32 }}>
              {t(
                'Estamos analisando as informações enviadas. Em breve você poderá começar a fazer suas entregas. Avisaremos quando a sua conta for aprovada.'
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
            <Text style={{ ...texts.xl, marginLeft: padding }}>{t('Autonomia e preço justo')}</Text>
          </View>
          <Text style={{ ...texts.md }}>
            {t(
              'No AppJusto, você pode definir o valor do seu serviço e mudar de frota quando quiser, escolhendo a melhor frota para cada dia.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(
              'O AppJusto não fica com nenhum valor da sua corrida! Retiramos apenas a taxa financeira, e o restante vai todo para você. Justo, né?'
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
            {t('No AppJusto, você sempre sabe o quanto está sendo cobrado:')}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t(
              '\u25CF Taxa da financeira pelo recebimento pelo serviço: cartão de crédito 2,21% + R$ 0,09 (compensa em 30 dias).'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t('\u25CF PIX: 0,99% (compensa no mesmo dia)')}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t('\u25CF Antecipação do cartão de crédito: 2,5%')}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32 }}>
            {t('\u25CF Transferência para sua conta quando você quiser: R$ 2,00')}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t('\u25CF Em breve, o AppJusto terá PIX para transferências grátis!')}
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
              'Como somos um movimento para o bem de todos, adotamos a presunção da inocência para qualquer situação que possa ocorrer. Bloqueio só após a apuração dos fatos, e você sempre terá um atendimento humano.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(
              'No AppJusto, você não tem Score. Trabalhe da maneira que for adequada, sem influenciar nos pedidos que tocam. Contamos que todos vão colaborar com esse movimento aceitando os pedidos, e não pressionando entregadores.'
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
              'Quanto mais consumidores satisfeitos, mais pedidos vão tocar, e mais você pode ganhar o valor que acha justo para você.'
            )}
          </Text>
          <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
            {t(
              'Você pode ajudar a aumentar a demanda indicando para outros entregadores, restaurantes e consumidores. Comece a divulgar o AppJusto agora mesmo!'
            )}
          </Text>
        </View>
        <View style={{ marginBottom: 48, paddingHorizontal: padding }}>
          <HomeShareCard
            title="Divulgue o AppJusto"
            subtitle="Compartilhe esse movimento por uma economia mais justa."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
