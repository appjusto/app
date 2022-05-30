// import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, NativeSyntheticEvent, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PagerView, { ViewPagerOnPageScrollEventData } from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import ConfigItem from '../../common/components/views/ConfigItem';
import HR from '../../common/components/views/HR';
import { useNotificationToken } from '../../common/hooks/useNotificationToken';
import { IconMotocycleBeta } from '../../common/icons/icon-motocycle-beta';
import HomeShareCard from '../../common/screens/home/cards/HomeShareCard';
import { SocialMediaCard } from '../../common/screens/home/cards/SocialMediaCard';
import * as config from '../../common/screens/unlogged/onboarding/config';
import { useSegmentScreen } from '../../common/store/api/track';
import { getCourier } from '../../common/store/courier/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { AppJustoAssistanceWhatsAppURL, AppJustoFreshdeskCourierURL } from '../../strings/values';
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
  const steps = config.profileSubmitted;
  const [step, setStep] = React.useState(0);
  // refs
  const pagerView = React.useRef<PagerView>(null);
  // notifications
  useNotificationToken();
  // side effects
  // tracking
  useSegmentScreen('Profile Submitted');
  // handlers
  const onPageScroll = (ev: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };
  const onPlaying = React.useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);
  // console.log(courier.id);
  // UI
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
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
          <View style={{ marginTop: 24, marginBottom: padding }}>
            <PagerView
              ref={pagerView}
              style={{ width: '100%', height: 200 }}
              onPageScroll={onPageScroll}
            >
              {steps.map(({ header, body, button }, index) => (
                <View key={index} style={{ paddingHorizontal: halfPadding }}>
                  <View
                    style={{
                      ...borders.default,
                      backgroundColor: colors.white,
                      borderColor: colors.white,
                      padding: 24,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                      height: 200,
                    }}
                  >
                    <Text style={[texts.md, texts.bold]}>{header}</Text>
                    <Text style={{ ...texts.md, marginTop: padding }}>{body}</Text>
                    {button && (
                      <DefaultButton
                        variant="secondary"
                        title={t('Adicionar')}
                        onPress={() => {
                          Linking.openURL(AppJustoAssistanceWhatsAppURL);
                        }}
                        style={{ marginTop: padding }}
                      />
                    )}
                  </View>
                </View>
              ))}
            </PagerView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {new Array(steps.length).fill('').map((_, i) => (
              <View
                style={{
                  height: halfPadding,
                  width: halfPadding,
                  ...borders.default,
                  borderColor: step === i ? colors.black : colors.white,
                  borderRadius: 4,
                  backgroundColor: step === i ? colors.black : colors.white,
                  marginRight: halfPadding,
                  marginBottom: 24,
                }}
                key={i}
              />
            ))}
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
              videoId="KOD94Vn80-o"
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
            onPress={() => {
              navigation.navigate('AboutTests');
            }}
          />
          <ConfigItem
            title={t('Autonomia e preço justo')}
            subtitle={t('Veja como você define o preço')}
            onPress={() => {
              navigation.navigate('AboutAutonomy');
            }}
          />
          <ConfigItem
            title={t('Transparência')}
            subtitle={t('Saiba sobre os valores recebidos ')}
            onPress={() => {
              navigation.navigate('AboutTransparency');
            }}
          />
          <ConfigItem
            title={t('Sem bloqueios automáticos')}
            subtitle={t('Entenda o motivo de não termos Score')}
            onPress={() => {
              navigation.navigate('AboutNoScore');
            }}
          />
          <ConfigItem
            title={t('Fique disponível para corridas')}
            subtitle={t('Saiba como ajudar o movimento')}
            onPress={() => {
              navigation.navigate('AboutBeAvailable');
            }}
          />
          <ConfigItem
            title={t('Central de Ajuda')}
            subtitle={t('Conheças as regras e saiba mais sobre o AppJusto')}
            onPress={() => {
              Linking.openURL(AppJustoFreshdeskCourierURL);
            }}
          />
          <ConfigItem
            title={t('Sobre o AppJusto')}
            subtitle={t('Acesse nossas páginas')}
            onPress={() => {
              navigation.navigate('AboutApp');
            }}
          />
        </View>
        <PaddedView>
          <View style={{ marginBottom: padding }}>
            <HomeShareCard
              title="Divulgue o AppJusto"
              subtitle="Clique para compartilhar esse movimento nas suas redes"
            />
          </View>
          <View style={{ marginBottom: padding }}>
            <SocialMediaCard app="whatsapp" />
          </View>
          <View>
            <SocialMediaCard app="instagram" />
          </View>
        </PaddedView>
      </ScrollView>
    </SafeAreaView>
  );
}
