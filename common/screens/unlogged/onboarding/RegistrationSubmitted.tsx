import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import RoundedText from '../../../components/texts/RoundedText';
import { IconLogoBlackandWhite } from '../../../icons/icon-logo-b&w';
import { IconPlay } from '../../../icons/icon-play';
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
  // redux store
  const consumer = useSelector(getConsumer);
  // state
  const steps = config.registrationSubmitted;
  const [step, setStep] = React.useState(0);
  // refs
  const viewPager = React.useRef<ViewPager>(null);
  // handlers
  const onPageScroll = (ev: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };
  console.log(consumer);
  // UI
  // UI
  if (!consumer) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ ...screens.config }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <PaddedView style={{ backgroundColor: colors.green500 }}>
          <RoundedText>{t('Pré-cadastro realizado com sucesso!')}</RoundedText>
          {/* add a "user counter" in this text. if user counter < 10, replace
          the string with 'Obrigado por fazer parte desse movimento em {nome da cidade}' */}
          <Text style={{ ...texts.x2l, marginVertical: padding }}>
            {t(`Você e mais 000 pessoas já fazem parte desse movimento em ${consumer.city}`)}
          </Text>
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
        <PaddedView>
          <Text style={{ ...texts.lg, marginBottom: 24 }}>
            {t('Enquanto isso, aproveite para conhecer mais sobre o AppJusto:')}
          </Text>
          {/* this ViewPager only shows in screen if you hardcode a height and width. why? */}
          <ViewPager
            ref={viewPager}
            style={{ width: '100%', height: 200 }}
            onPageScroll={onPageScroll}
          >
            {steps.map(({ header, body }, index) => (
              <View
                style={{
                  ...borders.default,
                  backgroundColor: colors.white,
                  borderColor: colors.white,
                  padding: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // flex: 1,
                }}
                key={index}
              >
                <Text style={[texts.md, texts.bold]}>{header}</Text>
                <Text style={{ ...texts.md, marginTop: padding }}>{body}</Text>
              </View>
            ))}
          </ViewPager>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
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
          <TouchableOpacity>
            <PaddedView
              style={{
                ...borders.default,
                width: '100%',
                height: 200,
                backgroundColor: colors.grey700,
                flexDirection: 'row',
                marginBottom: 24,
              }}
            >
              <View style={{ width: '50%' }}>
                <IconPlay />
                <Text style={{ ...texts.lg, marginTop: padding }}>
                  {t('Assistir vídeo explicativo')}
                </Text>
              </View>
              <View style={{ justifyContent: 'flex-end' }}>
                <IconLogoBlackandWhite />
              </View>
            </PaddedView>
          </TouchableOpacity>

          <SocialMediaCard app="instagram" />
        </PaddedView>
      </ScrollView>
    </SafeAreaView>
  );
};
