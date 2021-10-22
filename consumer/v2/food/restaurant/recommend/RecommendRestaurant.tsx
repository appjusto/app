import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import { phoneFormatter } from '../../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../../common/components/inputs/PatternInput';
import LabeledText from '../../../../../common/components/texts/LabeledText';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { getConsumer } from '../../../../../common/store/consumer/selectors';
import { showToast } from '../../../../../common/store/ui/actions';
import { colors, halfPadding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList, 'RecommendRestaurant'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
>;

type ScreenRouteProp = RouteProp<FoodOrderNavigatorParamList, 'RecommendRestaurant'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RecommendRestaurant = ({ navigation, route }: Props) => {
  // params
  const { place } = route.params ?? {};
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const consumer = useSelector(getConsumer);
  // screen state
  const [name, setName] = React.useState<string | undefined>();
  const [instagram, setInstagram] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [isLoading, setLoading] = React.useState(false);
  // refs
  // const cityRef = React.useRef<TextInput>(null);
  const instagramRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  //side effects
  React.useEffect(() => {
    if (place) setName(place.address.main);
  }, [place]);
  // tracking
  useSegmentScreen('RecommendRestaurant');
  // handler
  const sendRecommendationHandler = () => {
    Keyboard.dismiss();
    if (!place) return;
    (async () => {
      try {
        setLoading(true);
        await api.business().addRecomendation(place, consumer?.id, instagram, phone);
        track('consumer sent a restaurant recommendation to database');
        setLoading(false);
        dispatch(
          showToast(t('Recomendação enviada. Muito obrigado pela contribuição!'), 'success')
        );
        navigation.navigate('FoodOrderHome');
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar a recomendação. Tente novamente.'), 'error'));
      }
      setLoading(false);
    })();
  };
  // UI
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
        <Text style={{ ...texts.x2l }}>{t('Indique um restaurante')}</Text>
        <Text style={{ ...texts.sm, paddingTop: halfPadding, color: colors.grey700 }}>
          {t(
            'Estamos em constante expansão e queremos conhecer os seus restaurantes preferidos! Manda pra gente e vamos entrar em contato com eles.'
          )}
        </Text>
        <View style={{ marginTop: 32, flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              track("navigating to AddressComplete to find a restaurant's address");
              navigation.navigate('AddressComplete', {
                returnScreen: 'RecommendRestaurant',
                returnParam: 'place',
              });
            }}
          >
            <LabeledText
              title={t('Nome do restaurante')}
              placeholder={t('Qual restaurante você quer indicar?')}
              style={{ height: 54 }}
            >
              {name}
            </LabeledText>
          </TouchableOpacity>
          <DefaultInput
            ref={instagramRef}
            style={{ marginTop: 12 }}
            title={t('Instagram (se souber)')}
            placeholder={t('Se souber o Instagram, conta pra gente')}
            value={instagram}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setInstagram(text)}
            onSubmitEditing={() => phoneRef.current?.focus()}
            keyboardType="default"
          />
          <PatternInput
            ref={phoneRef}
            style={{ marginTop: 12 }}
            title={t('Telefone (se souber)')}
            value={phone}
            placeholder={t('Se souber o telefone, conta pra gente')}
            parser={numbersOnlyParser}
            formatter={phoneFormatter}
            keyboardType="number-pad"
            returnKeyType="next"
            blurOnSubmit
            onChangeText={(text) => setPhone(trim(text))}
          />
        </View>
        <View style={{ flex: 1 }} />
        <DefaultButton
          title={t('Indicar restaurante')}
          onPress={sendRecommendationHandler}
          disabled={!place}
          activityIndicator={isLoading}
        />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
