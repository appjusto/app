import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { IconHangLoose } from '../../../../../common/icons/icon-hang-loose';
import { IconInstagram } from '../../../../../common/icons/icon-instagram';
import HomeCard from '../../../../../common/screens/home/cards/HomeCard';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { getFlavor } from '../../../../../common/store/config/selectors';
import { colors, doublePadding, padding, screens, texts } from '../../../../../common/styles';
import { ApprovedParamList } from '../../../../../courier/approved/types';
import { t } from '../../../../../strings';
import { AppJustoRecommendationsInstagramPost } from '../../../../../strings/values';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList & ApprovedParamList, 'RecommendationFeedback'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
>;

type ScreenRouteProp = RouteProp<FoodOrderNavigatorParamList, 'RecommendationFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RecommendationFeedback = ({ navigation, route }: Props) => {
  // params
  const { returnToHome } = route.params ?? {};
  // redux
  const flavor = useSelector(getFlavor);
  //tracking
  useSegmentScreen('RecommendationFeedback');
  // handler
  const navigationHandler = () => {
    if (flavor === 'consumer') {
      if (returnToHome) {
        navigation.navigate('MainNavigator', { screen: 'Home' });
      } else {
        navigation.navigate('FoodOrderHome');
      }
    } else {
      // courier
      navigation.navigate('MainNavigator', { screen: 'Home' });
    }
  };
  // helper
  const buttonTitle = (() => {
    if (flavor === 'consumer') {
      if (returnToHome) {
        return t('Voltar');
      } else {
        return t('Ir para a lista de restaurantes');
      }
    } else return t('Voltar');
  })();
  return (
    <KeyboardAwareScrollView
      style={{
        ...screens.default,
        paddingHorizontal: padding,
        paddingTop: 48,
        paddingBottom: padding,
      }}
      enableOnAndroid
      enableAutomaticScroll
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <View style={{ flex: 1 }} />
      <View style={{ alignItems: 'center' }}>
        <IconHangLoose />
        <Text style={{ marginTop: doublePadding, ...texts.x2l, textAlign: 'center' }}>
          {t('Obrigado pela indicação')}
        </Text>
        <Text
          style={{ marginTop: padding, ...texts.md, color: colors.grey700, textAlign: 'center' }}
        >
          {t(
            'Entraremos em contato e esperamos que esse restaurante esteja no aplicativo em breve. Avisa pra eles que estamos chegando!'
          )}
        </Text>
        <TouchableOpacity
          style={{ marginTop: 24 }}
          onPress={() => {
            track('Opened AppJusto restaurants recommendations instagram post');
            Linking.openURL(AppJustoRecommendationsInstagramPost);
          }}
        >
          <HomeCard
            icon={<IconInstagram />}
            title={t('Acessar post de indicações')}
            subtitle={t(
              'Temos um post só para indicações no nosso Instagram. Para acelerar o processo, você pode marcar o @ deles e mostrar o quanto deseja vê-los aqui!'
            )}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton title={buttonTitle} onPress={navigationHandler} />
    </KeyboardAwareScrollView>
  );
};
