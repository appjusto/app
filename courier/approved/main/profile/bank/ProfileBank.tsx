import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bank, BankAccountType } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { hyphenFormatter } from '../../../../../common/components/inputs/pattern-input/formatters';
import { numbersAndLettersParser } from '../../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../../common/components/inputs/PatternInput';
import LabeledText from '../../../../../common/components/texts/LabeledText';
import useBanks from '../../../../../common/store/api/platform/hooks/useBanks';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { bankAccountSet } from '../../../../../common/store/courier/validators';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
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
  const api = React.useContext(ApiContext);

  // redux
  const busy = useSelector(getUIBusy);
  const courier = useSelector(getCourier)!;

  // screen state
  const banks = useBanks();
  const [type, setType] = React.useState<BankAccountType>('Corrente');
  const [bank, setBank] = React.useState<Bank>();
  const [agency, setAgency] = React.useState('');
  const [account, setAccount] = React.useState('');
  const canSubmit = bank && !isEmpty(agency) && !isEmpty(account);

  // refs
  const accountRef = React.useRef<TextInput>(null);

  // side effects
  // checking initial bank information
  React.useEffect(() => {
    if (bankAccountSet(courier)) {
      const { bankAccount } = courier;
      setBank(banks?.find((b) => b.name === bankAccount?.name));
      setType(bankAccount!.type);
      setAgency(bankAccount!.agency!);
      setAccount(bankAccount!.account);
    }
  }, [banks, courier]);
  // update bank according with route parameters
  React.useEffect(() => {
    const { bank } = route.params ?? {};
    if (bank) setBank(bank);
  }, [route.params]);

  //handlers
  const submitBankHandler = async () => {
    if (!bank || !agency || !account || !type) {
      return;
    }
    await dispatch(
      updateProfile(api)(courier!.id!, {
        bankAccount: {
          ...bank,
          agency,
          account,
          type,
        },
      })
    );
    navigation.goBack();
  };

  // UI
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="never">
        <PaddedView>
          <Text style={{ ...texts.sm, marginTop: halfPadding, color: colors.grey700 }}>
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
                  {bank?.name ?? t('Escolha seu banco')}
                </LabeledText>
              </View>
            </TouchableWithoutFeedback>
            <PatternInput
              key={bank?.name}
              style={{ marginTop: 16 }}
              title={t('Agência')}
              placeholder={
                (bank?.agencyPattern.indexOf('D') ?? -1) > -1
                  ? t('Número da agência com o dígito')
                  : t('Número da agência')
              }
              value={agency}
              mask={bank?.agencyPattern}
              parser={
                bank?.agencyPattern ? numbersAndLettersParser(bank?.agencyPattern) : undefined
              }
              formatter={
                bank?.agencyPattern ? hyphenFormatter(bank?.agencyPattern.indexOf('-')) : undefined
              }
              editable={!!bank}
              keyboardType="number-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setAgency(text)}
              onBlur={() => {
                if (agency.length > 0) {
                  const paddedAgency = numbersAndLettersParser(bank!.agencyPattern, true)(agency);
                  setAgency(paddedAgency);
                }
                accountRef.current?.focus();
              }}
            />
            <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
              <PatternInput
                key={bank?.name}
                ref={accountRef}
                style={{ flex: 7 }}
                title={t('Conta')}
                placeholder={
                  (bank?.accountPattern.indexOf('D') ?? -1) > -1
                    ? t('Número da conta com o dígito')
                    : t('Número da conta')
                }
                value={account}
                mask={bank?.accountPattern}
                parser={
                  bank?.accountPattern ? numbersAndLettersParser(bank?.accountPattern) : undefined
                }
                formatter={
                  bank?.accountPattern
                    ? hyphenFormatter(bank?.accountPattern.indexOf('-'))
                    : undefined
                }
                editable={!!bank}
                keyboardType="number-pad"
                returnKeyType="done"
                blurOnSubmit
                onChangeText={(text) => setAccount(text)}
                onBlur={() => {
                  if (account.length > 0) {
                    const paddedAccount = numbersAndLettersParser(
                      bank!.accountPattern,
                      true
                    )(account);
                    setAccount(paddedAccount);
                  }
                }}
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
