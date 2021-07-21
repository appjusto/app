import { CompositeNavigationProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import { phoneFormatter } from '../../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../../common/components/inputs/PatternInput';
import { UnloggedParamList } from '../../../../../common/screens/unlogged/types';
import { colors, halfPadding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { LoggedNavigatorParamList } from '../../../types';
import { FoodOrderNavigatorParamList } from '../../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<FoodOrderNavigatorParamList, 'RecommendRestaurant'>,
  StackNavigationProp<LoggedNavigatorParamList & UnloggedParamList>
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const RecommendRestaurant = ({ navigation }: Props) => {
  // screen state
  const [name, setName] = React.useState<string>('');
  const [city, setCity] = React.useState<string>('');
  const [instagram, setInstagram] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const cityRef = React.useRef<TextInput>(null);
  const instagramRef = React.useRef<TextInput>(null);
  const phoneRef = React.useRef<TextInput>(null);
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="never"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
        <Text style={{ ...texts.x2l }}>{t('Indique um restaurante')}</Text>
        <Text style={{ ...texts.sm, paddingTop: halfPadding, color: colors.grey700 }}>
          {t(
            'Estamos em constante expansão e queremos conhecer os seus restaurantes preferidos! Manda pra gente e vamos entrar em contato com eles.'
          )}
        </Text>
        <View style={{ marginTop: 32, flex: 1 }}>
          <DefaultInput
            ref={nameRef}
            // style={{ marginTop: padding }}
            title={t('Nome do restaurante')}
            placeholder={t('Qual o restaurante que você quer indicar?')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => cityRef.current?.focus()}
            keyboardType="default"
            // maxLength={30}
          />
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
            returnKeyType="done"
            blurOnSubmit
            onChangeText={(text) => setPhone(trim(text))}
          />
        </View>
        <View style={{ flex: 1 }} />
        <DefaultButton title={t('Indicar restaurante')} />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
