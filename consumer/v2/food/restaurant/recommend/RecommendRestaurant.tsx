import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import { phoneFormatter } from '../../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../../common/components/inputs/PatternInput';
import LabeledText from '../../../../../common/components/texts/LabeledText';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
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
  // screen state
  const [name, setName] = React.useState<string | undefined>();
  const [city, setCity] = React.useState<string>('');
  const [instagram, setInstagram] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  // refs
  const cityRef = React.useRef<TextInput>(null);
  const instagramRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  //side effects
  React.useEffect(() => {
    if (place) setName(place.address.main);
  }, [place]);
  // handler
  const onSendRecommendation = () => null;
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
            onPress={() =>
              navigation.navigate('AddressComplete', {
                returnScreen: 'RecommendRestaurant',
                returnParam: 'place',
              })
            }
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
            ref={cityRef}
            style={{ marginTop: 12 }}
            title={t('Cidade')}
            placeholder={t('Digite a cidade do restaurante')}
            value={city}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setCity(text)}
            onSubmitEditing={() => instagramRef.current?.focus()}
            keyboardType="default"
          />
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
            title={t('Telefone (se souber')}
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
          onPress={onSendRecommendation}
          disabled={!place}
        />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
