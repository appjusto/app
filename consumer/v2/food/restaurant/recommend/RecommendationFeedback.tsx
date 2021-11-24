import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import { IconHangLoose } from '../../../../../common/icons/icon-hang-loose';
import { IconInstagram } from '../../../../../common/icons/icon-instagram';
import HomeCard from '../../../../../common/screens/home/cards/HomeCard';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { colors, doublePadding, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { AppJustoRecommendationsInstagramPost } from '../../../../../strings/values';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList, 'RecommendationFeedback'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const RecommendationFeedback = ({ navigation }: Props) => {
  //tracking
  useSegmentScreen('RecommendationFeedback');
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
      <DefaultButton
        title={t('Voltar para a lista de restaurantes')}
        onPress={() => navigation.navigate('FoodOrderHome')}
      />
    </KeyboardAwareScrollView>
  );
};
