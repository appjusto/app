import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { trim } from 'lodash';
import React, { useState, useRef, useContext } from 'react';
import { ScrollView, View, TextInput } from 'react-native';

import { saveCard } from '../../store/consumer/actions';
import { t } from '../../strings';
import { ApiContext } from '../app/context';
import AvoidingView from '../common/AvoidingView';
import DefaultButton from '../common/DefaultButton';
import DefaultInput from '../common/DefaultInput';
import { screens, padding } from '../common/styles';
import PaddedView from '../common/views/PaddedView';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileCards'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileCards'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);

  // refs
  const expirationMonthRef = useRef<TextInput>(null);
  const expirationYearRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);

  // state
  const [number, setNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [cvv, setCVV] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCPF] = useState('');
  const [updating, setUpdating] = useState(false);

  // handlers
  const saveCardHandler = async () => {
    if (updating) return;
    setUpdating(true);
    try {
      await saveCard(api)({
        number,
        expirationMonth,
        expirationYear,
        cvv,
        holderName: name,
        holderDocument: cpf,
      });
      navigation.pop(route.params?.popCount);
    } catch (error) {
      console.error(error);
    }
    setUpdating(false);
  };

  // UI
  return (
    <PaddedView style={{ ...screens.configScreen }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <AvoidingView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              style={{ flex: 1 }}
              title={t('Número do cartão')}
              value={number}
              placeholder={t('0000 0000 0000 0000')}
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setNumber(trim(text))}
              onSubmitEditing={() => expirationMonthRef.current?.focus()}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              ref={expirationMonthRef}
              style={{ flex: 2, marginRight: padding }}
              title={t('Mês de validade')}
              value={expirationMonth}
              placeholder={t('00')}
              maxLength={2}
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setExpirationMonth(trim(text))}
              onSubmitEditing={() => expirationYearRef.current?.focus()}
            />
            <DefaultInput
              ref={expirationYearRef}
              style={{ flex: 2, marginRight: padding }}
              title={t('Ano de validade')}
              value={expirationYear}
              placeholder={t('00')}
              maxLength={2}
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setExpirationYear(trim(text))}
              onSubmitEditing={() => cvvRef.current?.focus()}
            />
            <DefaultInput
              ref={cvvRef}
              style={{ flex: 1 }}
              title={t('CVV')}
              value={cvv}
              placeholder={t('000')}
              maxLength={4}
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setCVV(trim(text))}
              onSubmitEditing={() => nameRef.current?.focus()}
            />
          </View>
          <DefaultInput
            ref={nameRef}
            style={{ marginTop: 12 }}
            title={t('Nome do titular')}
            value={name}
            placeholder={t('Nome impresso no cartão')}
            keyboardType="name-phone-pad"
            returnKeyType="next"
            autoCapitalize="characters"
            blurOnSubmit={false}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => cpfRef.current?.focus()}
          />
          <DefaultInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF do titular')}
            value={cpf}
            placeholder={t('00000000000')}
            maxLength={11}
            onChangeText={(text) => setCPF(trim(text))}
            keyboardType="number-pad"
            returnKeyType="done"
            blurOnSubmit
          />
          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Salvar')}
            onPress={saveCardHandler}
            activityIndicator={updating}
          />
        </AvoidingView>
      </ScrollView>
    </PaddedView>
  );
}
