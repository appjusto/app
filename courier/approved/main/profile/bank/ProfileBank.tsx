import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Bank, BankAccountType } from 'appjusto-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../../common/app/context';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { hyphenFormatter } from '../../../../../common/components/inputs/pattern-input/formatters';
import { numbersAndLettersParser } from '../../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../../common/components/inputs/PatternInput';
import LabeledText from '../../../../../common/components/texts/LabeledText';
import { DefaultModal } from '../../../../../common/components/views/DefaultModal';
import useBanks from '../../../../../common/store/api/platform/hooks/useBanks';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { bankAccountSet } from '../../../../../common/store/courier/validators';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierProfileParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'ProfileBank'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'ProfileBank'>;

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
  const { bankAccount } = courier;
  // screen state
  const banks = useBanks();
  const [type, setType] = React.useState<BankAccountType>('Corrente');
  const [selectedBank, setSelectedBank] = React.useState<Bank>();
  const [agency, setAgency] = React.useState('');
  const [account, setAccount] = React.useState('');
  const [warning, setWarning] = React.useState<string>();
  const canSubmit = selectedBank && !isEmpty(agency) && !isEmpty(account);
  // refs
  const accountRef = React.useRef<TextInput>(null);
  // side effects
  // checking initial bank information
  React.useEffect(() => {
    if (bankAccount && bankAccountSet(bankAccount)) {
      const bank = banks?.find((b) => b.name === bankAccount?.name);
      if (bank) {
        setSelectedBank(bank);
        setType(bankAccount!.type);
        setAgency(bankAccount!.agency!);
        setAccount(bankAccount!.account);
      }
    }
  }, [banks, courier]);
  React.useEffect(() => {
    if (!selectedBank) return;
    if (bankAccount?.name === selectedBank.name) return; // no need to alert during update
    setWarning(selectedBank.warning);
  }, [bankAccount?.name, selectedBank]);
  React.useEffect(() => {
    const { bank } = route.params ?? {};
    if (bank) setSelectedBank(bank);
  }, [route.params]);
  // helpers
  const agencyParser = selectedBank?.agencyPattern
    ? numbersAndLettersParser(selectedBank?.agencyPattern)
    : undefined;
  const agencyFormatter = selectedBank?.agencyPattern
    ? hyphenFormatter(selectedBank?.agencyPattern.indexOf('-'))
    : undefined;
  const accountParser = selectedBank?.accountPattern
    ? numbersAndLettersParser(selectedBank?.accountPattern)
    : undefined;
  const accountFormatter = selectedBank?.accountPattern
    ? hyphenFormatter(selectedBank?.accountPattern.indexOf('-'))
    : undefined;
  //handlers
  const submitBankHandler = async () => {
    if (!selectedBank || !agency || !account || !type) {
      return;
    }
    await dispatch(
      updateProfile(api)(courier!.id!, {
        bankAccount: {
          type,
          name: selectedBank.name,
          agency,
          agencyFormatted: agencyFormatter!(agency),
          account,
          accountFormatted: accountFormatter!(account),
        },
      })
    );
    navigation.goBack();
  };

  // UI
  return (
    <>
      <ScrollView style={screens.config} contentContainerStyle={{ flex: 1 }}>
        <PaddedView style={{ flex: 1 }}>
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
          <View style={{ marginTop: halfPadding, flex: 1 }}>
            <Pressable
              onPress={() => {
                navigation.navigate('SelectBank');
              }}
            >
              <View>
                <LabeledText style={{ marginTop: padding }} title={t('Banco')}>
                  {selectedBank?.name ?? t('Escolha seu banco')}
                </LabeledText>
              </View>
            </Pressable>
            <PatternInput
              key={selectedBank?.name}
              style={{ marginTop: 16 }}
              title={t('Agência')}
              placeholder={
                (selectedBank?.agencyPattern.indexOf('D') ?? -1) > -1
                  ? t('Número da agência com o dígito')
                  : t('Número da agência')
              }
              value={agency}
              mask={selectedBank?.agencyPattern}
              parser={agencyParser}
              formatter={agencyFormatter}
              editable={!!selectedBank}
              keyboardType={
                (selectedBank?.agencyPattern.indexOf('X') ?? -1) > -1 ? 'default' : 'number-pad'
              }
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(text) => setAgency(text)}
              onSubmitEditing={() => accountRef.current?.focus()}
              onBlur={() => {
                if (agency.length > 0) {
                  const paddedAgency = numbersAndLettersParser(
                    selectedBank!.agencyPattern,
                    true
                  )(agency);
                  setAgency(paddedAgency);
                }
              }}
            />
            <View
              style={{
                marginTop: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <PatternInput
                key={selectedBank?.name}
                ref={accountRef}
                style={{ flex: 1 }}
                title={t('Conta')}
                placeholder={
                  (selectedBank?.accountPattern.indexOf('D') ?? -1) > -1
                    ? t('Número da conta com o dígito')
                    : t('Número da conta')
                }
                value={account}
                mask={selectedBank?.accountPattern}
                parser={accountParser}
                formatter={accountFormatter}
                editable={!!selectedBank}
                keyboardType={
                  (selectedBank?.accountPattern.indexOf('X') ?? -1) > -1 ? 'default' : 'number-pad'
                }
                returnKeyType="done"
                blurOnSubmit
                onChangeText={(text) => setAccount(text)}
                onBlur={() => {
                  if (account.length > 0) {
                    const paddedAccount = numbersAndLettersParser(
                      selectedBank!.accountPattern,
                      true
                    )(account);
                    setAccount(paddedAccount);
                  }
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1 }} />
          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Avançar')}
            disabled={!canSubmit}
            activityIndicator={busy}
            onPress={submitBankHandler}
          />
        </PaddedView>
      </ScrollView>
      <DefaultModal
        header={t('Atenção')}
        body={warning ?? ''}
        dismissButtonTitle={t('Ok, entendi')}
        onDismiss={() => {
          setWarning(undefined);
        }}
        visible={warning !== undefined}
      />
    </>
  );
}
