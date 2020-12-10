import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bank, BankAccountType } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React, { useRef, useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, TouchableWithoutFeedback, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../../../common/components/texts/LabeledText';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { bankAccountSet } from '../../../../../common/store/courier/validators';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../../common/store/user/actions';
import { texts, screens, padding, colors, halfPadding } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { BankParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<BankParamList, 'ProfileBank'>;
type ScreenRouteProp = RouteProp<BankParamList, 'ProfileBank'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // app state
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier);

  // screen state
  const [bank, setBank] = useState<null | Bank>(null);
  const [agency, setAgency] = useState<string>('');
  const [type, setType] = useState<BankAccountType>();
  const [account, setAccount] = useState<string>('');
  const [digit, setDigit] = useState<string>('');
  const canSubmit = useMemo(() => {
    return bank != null && !isEmpty(agency) && !isEmpty(account) && !isEmpty(digit);
  }, [bank, agency, account, digit]);

  // refs
  const accountRef = useRef<TextInput>(null);
  const digitRef = useRef<TextInput>(null);

  // side effects
  // checking initial bank information
  useEffect(() => {
    if (bankAccountSet(courier)) {
      const { bankAccount } = courier!;
      const courierBank: Bank = {
        name: bankAccount!.name!,
      };
      setBank(courierBank);
      setAgency(bankAccount!.agency!);
      setAccount(bankAccount!.account);
      setDigit(bankAccount!.digit!);
      setType(bankAccount!.type);
    }
  }, []);
  // update bank according with route parameters
  useEffect(() => {
    const { bank } = route.params ?? {};
    if (bank) setBank(bank);
  }, [route.params]);

  //handlers
  const submitBankHandler = async () => {
    if (!bank || !agency || !account || !digit || !type) {
      return;
    }
    await dispatch(
      updateProfile(api)(courier!.id!, {
        bankAccount: {
          ...bank,
          agency,
          account,
          digit,
          type,
        },
      })
    );
    navigation.goBack();
  };

  // UI
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView>
        <PaddedView>
          <Text style={{ ...texts.default, marginTop: halfPadding, color: colors.darkGrey }}>
            {t('A conta precisa estar no seu CPF ou CNPJ. Não serão aceitas contas de terceiros.')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: halfPadding,
            }}
          >
            <RadioButton
              title={t('Conta-Corrente')}
              onPress={() => setType('Corrente')}
              checked={type === 'Corrente'}
            />
            <View style={{ marginLeft: padding }}>
              <RadioButton
                title={t('Poupança')}
                onPress={() => setType('Poupança')}
                checked={type === 'Poupança'}
              />
            </View>
          </View>
          <View style={{ marginTop: halfPadding }}>
            {/* <DefaultInput title={t('Banco')} value={bank} onChangeText={(text) => setBank(text)} /> */}
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('SelectBank');
              }}
            >
              <View>
                <LabeledText style={{ marginTop: padding }} title={t('Banco')}>
                  {bank?.name ?? t('Nome do seu banco')}
                </LabeledText>
              </View>
            </TouchableWithoutFeedback>
            <DefaultInput
              style={{ marginTop: 16 }}
              title={t('Agência')}
              placeholder={t('Número da agência sem o dígito')}
              value={agency}
              onChangeText={(text) => setAgency(text)}
              keyboardType="number-pad"
              returnKeyType="next"
              maxLength={5}
              blurOnSubmit={false}
              onSubmitEditing={() => accountRef.current?.focus()}
            />
            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
              <DefaultInput
                ref={accountRef}
                style={{ flex: 7 }}
                title={t('Conta')}
                placeholder={t('Número sem o dígito')}
                value={account}
                onChangeText={(text) => setAccount(text)}
                keyboardType="number-pad"
                returnKeyType="next"
                maxLength={20}
                blurOnSubmit={false}
                onSubmitEditing={() => digitRef.current?.focus()}
              />
              <DefaultInput
                ref={digitRef}
                style={{ flex: 3, marginLeft: halfPadding }}
                title={t('Dígito')}
                value={digit}
                onChangeText={(text) => setDigit(text)}
                keyboardType="default"
                maxLength={1}
                returnKeyType="done"
                blurOnSubmit
              />
            </View>
          </View>
          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Avançar')}
            disabled={!canSubmit}
            activityIndicator={busy}
            onPress={submitBankHandler}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
