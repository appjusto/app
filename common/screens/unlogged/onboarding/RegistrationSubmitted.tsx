// import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, NativeSyntheticEvent, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PagerView, { ViewPagerOnPageScrollEventData } from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useSelector } from 'react-redux';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { t } from '../../../../strings';
import { ApiContext } from '../../../app/context';
import PaddedView from '../../../components/containers/PaddedView';
import RoundedText from '../../../components/texts/RoundedText';
import useNotificationToken from '../../../hooks/useNotificationToken';
import { useCityStatistics } from '../../../store/api/platform/hooks/useCityStatistics';
import { useSegmentScreen } from '../../../store/api/track';
import { getConsumer } from '../../../store/consumer/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../styles';
import HomeShareCard from '../../home/cards/HomeShareCard';
import { SocialMediaCard } from '../../home/cards/SocialMediaCard';
import * as config from './config';

type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'RegistrationSubmitted'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'RegistrationSubmitted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RegistrationSubmitted = ({ navigation, route }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const consumer = useSelector(getConsumer)!;
  const { city, situation } = consumer;
  // state
  const steps = config.registrationSubmitted;
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const cityStats = useCityStatistics(city);
  const [totalConsumersInCity, setTotalConsumersInCity] = React.useState<number>(0);
  useNotificationToken();
  // refs
  const pagerView = React.useRef<PagerView>(null);
  // tracking
  useSegmentScreen('Registration Submitted');
  // side effects
  // submit profile
  React.useEffect(() => {
    api.profile().updateProfile(consumer.id, { situation: 'submitted' });
  }, [api, consumer.id]);
  // update city statistics
  React.useEffect(() => {
    if (cityStats) setTotalConsumersInCity(cityStats.consumers);
  }, [cityStats]);
  // react to approved
  React.useEffect(() => {
    if (situation === 'approved') {
      navigation.replace('MainNavigator', { screen: 'Home' });
    }
  }, [situation, navigation]);
  // handlers
  const onPageScroll = (ev: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };
  const onVideoChangeState = React.useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);
  // UI
  if (!totalConsumersInCity) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ ...screens.config }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <PaddedView style={{ backgroundColor: colors.green500 }}>
          <RoundedText>{t('Pré-cadastro realizado com sucesso!')}</RoundedText>
          {totalConsumersInCity > 1 ? (
            <Text style={{ ...texts.x2l, marginVertical: padding }}>
              {t(
                `Você e mais ${totalConsumersInCity} pessoas já fazem parte desse movimento em ${city}`
              )}
            </Text>
          ) : (
            <Text style={{ ...texts.x2l, marginVertical: padding }}>
              {t(`Obrigado por fazer parte desse movimento em ${city}`)}
            </Text>
          )}

          <Text style={{ ...texts.md, marginBottom: 24 }}>
            {t(
              'Quanto mais gente compartilhar essa ideia, mais rápido um delivery justo para todos será realidade. Participe divulgando!'
            )}
          </Text>
          <HomeShareCard
            title="Divulgue o AppJusto"
            subtitle="Clique para compartilhar o movimento nas suas redes"
          />
        </PaddedView>
        <View style={{ flex: 1 }}>
          <PaddedView>
            <Text style={{ ...texts.lg, marginBottom: halfPadding }}>
              {t('Enquanto isso, aproveite para conhecer mais sobre o AppJusto:')}
            </Text>
          </PaddedView>

          {/* this ViewPager only shows in screen if you hardcode a height and width. why? */}
          <PagerView
            ref={pagerView}
            style={{ width: '100%', height: 200 }}
            onPageScroll={onPageScroll}
          >
            {steps.map(({ header, body }, index) => (
              <PaddedView key={index}>
                <View
                  style={{
                    ...borders.default,
                    backgroundColor: colors.white,
                    borderColor: colors.white,
                    padding: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <Text style={[texts.md, texts.bold]}>{header}</Text>
                  <Text style={{ ...texts.md, marginTop: padding }}>{body}</Text>
                </View>
              </PaddedView>
            ))}
          </PagerView>

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
                  borderColor: step === i ? colors.black : colors.grey500,
                  borderRadius: 4,
                  backgroundColor: step === i ? colors.black : colors.grey500,
                  marginRight: halfPadding,
                  marginVertical: 24,
                }}
                key={i}
              />
            ))}
          </View>
          <PaddedView style={{ marginTop: halfPadding, borderRadius: halfPadding }}>
            <YoutubePlayer
              height={200}
              play={playing}
              videoId="QM81nPxGBXQ"
              onChangeState={onVideoChangeState}
              webViewStyle={{ borderRadius: halfPadding }}
            />
          </PaddedView>
          <View style={{ marginHorizontal: padding, marginTop: 24, marginBottom: padding }}>
            <SocialMediaCard app="instagram" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
