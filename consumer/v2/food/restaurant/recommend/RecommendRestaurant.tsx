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
import { ApprovedParamList } from '../../../../../courier/approved/types';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList & ApprovedParamList, 'RecommendRestaurant'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
>;

type ScreenRouteProp = RouteProp<FoodOrderNavigatorParamList, 'RecommendRestaurant'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RecommendRestaurant = ({ navigation, route }: Props) => {
  // params
  const { place, returnToHome } = route.params ?? {};
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const consumer = useSelector(getConsumer);
  // screen state
  const [name, setName] = React.useState<string | undefined>();
  const [instagram, setInstagram] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [owner, setOwner] = React.useState<string>('');
  const [isLoading, setLoading] = React.useState(false);
  // refs
  const instagramRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  const ownerRef = React.useRef<TextInput>(null);
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
        await api.business().addRecomendation(place, consumer?.id, instagram, phone, owner);
        track('consumer sent a restaurant recommendation to database');
        setLoading(false);
        navigation.replace('RecommendationFeedback', { returnToHome });
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
              navigation.navigate('AddressComplete', {
                returnScreen: 'RecommendRestaurant',
                returnParam: 'place',
                returnToHome,
              });
            }}
          >
            <LabeledText
              title={t('Qual o restaurante?')}
              placeholder={t('Nome do restaurante')}
              style={{ height: 54 }}
            >
              {name}
            </LabeledText>
          </TouchableOpacity>
          <DefaultInput
            ref={instagramRef}
            style={{ marginTop: 12 }}
            title={t('Sabe o Instagram?')}
            placeholder={t('@instagram')}
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
            title={t('Sabe o telefone?')}
            value={phone}
            placeholder={t('Telefone do restaurante')}
            parser={numbersOnlyParser}
            formatter={phoneFormatter}
            keyboardType="number-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setPhone(trim(text))}
          />
          <DefaultInput
            ref={ownerRef}
            style={{ marginTop: 12 }}
            title={t('Sabe o nome do dono ou gerente?')}
            placeholder={t('Faz toda a diferença pra parceria')}
            value={owner}
            returnKeyType="next"
            blurOnSubmit
            onChangeText={(text) => setOwner(text)}
            keyboardType="default"
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
