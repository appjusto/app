import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React, { useRef, useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import LabeledText from '../../../../common/components/texts/LabeledText';
import AvoidingView from '../../../../common/components/views/AvoidingView';
import { getCourier } from '../../../../common/store/courier/selectors';
import { getUIBusy } from '../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../common/store/user/actions';
import { texts, screens, padding, colors } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileBank'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileBank'>;

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
  const [bank, setBank] = useState<null | { bankId: string; bankName: string }>(null);
  const [agency, setAgency] = useState<string>(courier?.bankInfo?.agency ?? '');
  const [account, setAccount] = useState<string>(courier?.bankInfo?.account ?? '');
  const [digit, setDigit] = useState<string>(courier?.bankInfo?.digit ?? '');
  const canSubmit = useMemo(() => {
    return bank != null && !isEmpty(agency) && !isEmpty(account) && !isEmpty(digit);
  }, [bank, agency, account, digit]);

  // refs
  const scrollViewRef = useRef<ScrollView>(null);
  // const agencyRef = useRef<TextInput>(null);
  const accountRef = useRef<TextInput>(null);
  const digitRef = useRef<TextInput>(null);

  // side effects
  useEffect(() => {
    const { bank } = route.params ?? {};
    if (bank) setBank(bank);
  }, [route.params]);

  //handlers
  const submitBankHandler = async () => {
    if (!bank || !agency || !account || !digit) {
      return;
    }
    await dispatch(
      updateProfile(api)(courier!.id!, {
        bankInfo: {
          name: `${bank.bankId} - ${bank.bankName}`, // TODO: leave just ID after moving bank database to firebase
          agency,
          account,
          digit,
        },
      })
    );
    navigation.goBack();
  };

  // UI
  return (
    <View style={{ ...screens.configScreen, paddingHorizontal: padding }}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flex: 1 }}>
        <AvoidingView>
          <Text style={{ ...texts.big, marginTop: 16 }}>{t('Dados bancários')}</Text>
          <Text style={{ ...texts.default, marginTop: 8, color: colors.darkGrey }}>
            {t('A conta precisa estar no seu CPF. Não serão aceitas contas de terceiros.')}
          </Text>
          <View style={{ marginTop: 24 }}>
            {/* <DefaultInput title={t('Banco')} value={bank} onChangeText={(text) => setBank(text)} /> */}
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('SelectBank');
              }}
            >
              <View>
                <LabeledText style={{ marginTop: padding }} title={t('Banco')}>
                  {bank?.bankName ?? t('Nome do seu banco')}
                </LabeledText>
              </View>
            </TouchableWithoutFeedback>
            <DefaultInput
              // ref={agencyRef}
              style={{ marginTop: 16 }}
              title={t('Agência')}
              value={agency}
              onChangeText={(text) => setAgency(text)}
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => accountRef.current?.focus()}
            />
            <View style={{ marginTop: 16, justifyContent: 'space-between' }}>
              <DefaultInput
                ref={accountRef}
                title={t('Conta')}
                value={account}
                onChangeText={(text) => setAccount(text)}
                keyboardType="number-pad"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => digitRef.current?.focus()}
              />
              <DefaultInput
                ref={digitRef}
                style={{ marginTop: 16 }}
                title={t('Dígito')}
                value={digit}
                onChangeText={(text) => setDigit(text)}
                keyboardType="number-pad"
                returnKeyType="done"
                blurOnSubmit
              />
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginBottom: 32 }}
            title={t('Avançar')}
            disabled={!canSubmit}
            activityIndicator={busy}
            onPress={submitBankHandler}
          />
        </AvoidingView>
      </ScrollView>
    </View>
  );
}
