import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, Linking, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSelector } from 'react-redux';
import { greenCheck } from '../../assets/icons';
import { ApiContext } from '../../common/app/context';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import HR from '../../common/components/views/HR';
import { IconMotocycleBeta } from '../../common/icons/icon-motocycle-beta';
import HomeShareCard from '../../common/screens/home/cards/HomeShareCard';
import { SocialMediaCard } from '../../common/screens/home/cards/SocialMediaCard';
import { useSegmentScreen } from '../../common/store/api/track';
import { getCourier } from '../../common/store/courier/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { FreshDeskCard } from '../approved/main/home/FreshDeskCard';
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
  // screen state
  const [playing, setPlaying] = React.useState(false);

  // side effects
  // tracking
  useSegmentScreen('Profile Submitted');
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
  // handlers
  const onPlaying = React.useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  // UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ ...screens.config }}>
        <View
          style={{
            backgroundColor: colors.green500,
            paddingHorizontal: padding,
            paddingTop: 48,
          }}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <IconMotocycleBeta />
            <Text style={{ ...texts.x2l, marginTop: 32 }}>
              {t('Cadastro enviado para o\n período de testes!')}
            </Text>
          </View>
        </View>
        <PaddedView>
          <Text style={{ ...texts.lg }}>
            {t('Enquanto isso, aproveite para conhecer mais sobre o AppJusto:')}
          </Text>
          <View style={{ marginTop: padding }}>
            <YoutubePlayer
              height={200}
              play={playing}
              videoId="QM81nPxGBXQ" // add the courier video
              onChangeState={onPlaying}
              webViewStyle={{ borderRadius: halfPadding }}
            />
          </View>
        </PaddedView>
        <View>
          <HR color={colors.grey500} />
          <ConfigItem
            title={t('Sobre o período de testes')}
            subtitle={t('Saiba como acontecerão os testes')}
            onPress={() => null}
          />
          <ConfigItem
            title={t('Saiba como acontecerão os testes')}
            subtitle={t('Veja como você define o preço')}
            onPress={() => null}
          />
          <ConfigItem
            title={t('Transparência')}
            subtitle={t('Saiba sobre os valores recebidos ')}
            onPress={() => null}
          />
          <ConfigItem
            title={t('Sem bloqueios automáticos')}
            subtitle={t('Entenda o motivo de não termos Score')}
            onPress={() => null}
          />
          <ConfigItem
            title={t('Fique disponível para corridas')}
            subtitle={t('Saiba como ajudar o movimento')}
            onPress={() => null}
          />
          <ConfigItem
            title={t('Central de Ajuda')}
            subtitle={t('Conheças as regras e saiba mais sobre o AppJusto')}
            onPress={() => null}
          />
        </View>
        <View style={{ marginHorizontal: padding }}>
          <View
            style={{
              marginTop: 48,
              marginBottom: padding,
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
          <SocialMediaCard app="instagram" />
          <View style={{ marginVertical: padding, marginBottom: 48 }}>
            <SocialMediaCard app="whatsapp" />
          </View>
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
            <Text style={{ ...texts.xl, marginLeft: padding }}>{t('Ficou alguma dúvida?')}</Text>
          </View>
          <Text style={{ ...texts.md, marginBottom: 48 }}>
            {t(
              'Acesse nossa Central de ajuda e veja todo o material de suporte que preparamos para você.'
            )}
          </Text>
          <View style={{ marginBottom: 48 }}>
            <FreshDeskCard
              onPress={() =>
                Linking.openURL(
                  'https://appjusto.freshdesk.com/support/solutions/folders/67000533349'
                )
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
