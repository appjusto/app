import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { validate } from 'gerador-validador-cpf';
import { trim } from 'lodash';
import React, { useState, useRef, useContext } from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import AvoidingView from '../../../common/components/views/AvoidingView';
import PaddedView from '../../../common/components/views/PaddedView';
import { ProfileParamList } from '../../../common/screens/profile/types';
import { saveCard } from '../../../common/store/consumer/actions';
import { showToast } from '../../../common/store/ui/actions';
import { screens, padding } from '../../../common/styles';
import { t } from '../../../strings';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileAddCard'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileAddCard'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const { returnScreen } = route.params ?? {};

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
    // TODO: validate all card information
    if (!validate(cpf)) {
      dispatch(showToast(t('CPF não é válido.')));
      return;
    }
    setUpdating(true);
    try {
      const cardResult = await saveCard(api)({
        number,
        expirationMonth,
        expirationYear,
        cvv,
        holderName: name,
        holderDocument: cpf,
      });
      if (returnScreen) navigation.navigate(returnScreen, { cardId: cardResult.id });
      else navigation.pop();
    } catch (error) {
      dispatch(showToast(error.toString()));
    }
    setUpdating(false);
  };

  // UI
  return (
    <PaddedView style={{ ...screens.configScreen }}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <AvoidingView>
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
          <View style={{ flex: 1 }} />
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
