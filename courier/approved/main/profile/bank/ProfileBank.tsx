import { Bank, BankAccountPersonType, BankAccountType } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { track, useSegmentScreen } from '../../../../../common/store/api/track';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { bankAccountSet } from '../../../../../common/store/courier/validators';
import { showToast } from '../../../../../common/store/ui/actions';
import { getUIBusy } from '../../../../../common/store/ui/selectors';
import { updateProfile } from '../../../../../common/store/user/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierProfileParamList } from '../types';
import { BankModal } from './BankModal';

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
  const [personType, setPersonType] = React.useState<BankAccountPersonType>('Pessoa Física');
  const [modalVisible, setModalVisible] = React.useState(false);
  const canSubmit = selectedBank && !isEmpty(agency) && !isEmpty(account) && type && personType;
  const profileApproved = courier.situation === 'approved';
  // refs
  const accountRef = React.useRef<TextInput>(null);
  // side effects
  // tracking
  useSegmentScreen('ProfileBank');
  // checking initial bank information
  React.useEffect(() => {
    if (bankAccount && bankAccountSet(bankAccount)) {
      const bank = banks?.find((b) => b.name === bankAccount?.name);
      if (bank) {
        setSelectedBank(bank);
        setType(bankAccount!.type);
        setAgency(bankAccount!.agency!);
        setAccount(bankAccount!.account);
        setPersonType(bankAccount!.personType);
      }
    }
  }, [banks, courier, bankAccount]);
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
  const cefAccountCode = (() => {
    if (!selectedBank) return;
    if (selectedBank.code === '104') {
      if (personType === 'Pessoa Jurídica') {
        if (type === 'Corrente') {
          return '003';
        } else if (type === 'Poupança') {
          return '022';
        }
      } else if (personType === 'Pessoa Física') {
        if (type === 'Corrente') {
          return '001';
        } else if (type === 'Simples') {
          return '002';
        } else if (type === 'Poupança') {
          return '013';
        } else if (type === 'Nova Poupança') {
          return '1288';
        }
      }
    } else return undefined;
  })();
  const accountMask = selectedBank?.accountPattern;
  //handlers
  const submitBankHandler = async () => {
    Keyboard.dismiss();
    if (!selectedBank || !agency || !account || !type) {
      return;
    }
    if (selectedBank.code === '341' && agencyFormatter!(agency) === '0500') {
      dispatch(
        showToast('A iugu ainda não aceita contas Itaú - iti. Escolha outra, por favor.', 'error')
      );
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
          accountFormatted:
            selectedBank.code !== '104'
              ? accountFormatter!(account)
              : personType === 'Pessoa Física' && type === 'Nova Poupança'
              ? cefAccountCode + accountFormatter!(account)
              : cefAccountCode + '0' + accountFormatter!(account),
          personType,
        },
      })
    );
    track('courier updated profile with bak info');
    navigation.goBack();
  };
  // UI
  return (
    <View style={{ ...screens.config }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardOpeningTime={0}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="never"
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <PaddedView style={{ flex: 1 }}>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            <Text style={{ color: colors.red }}>{t('Aviso: ')}</Text>
            {t(
              'a conta precisa estar no seu nome ou da sua MEI ou empresa.\n Se seu CNPJ for de um MEI, você poderá cadastrar sua conta Pessoa Física. Caso contrário, você precisará cadastrar uma conta corrente no nome da sua Pessoa Jurídica. '
            )}
          </Text>
          <View style={{ marginTop: padding }}>
            <RadioButton
              title={t('Pessoa Física')}
              onPress={() => {
                if (!profileApproved) setPersonType('Pessoa Física');
              }}
              checked={personType === 'Pessoa Física'}
            />
            <View style={{ marginTop: halfPadding }}>
              <RadioButton
                title={t('Pessoa Jurídica')}
                onPress={() => {
                  if (!profileApproved) {
                    setPersonType('Pessoa Jurídica');
                    setModalVisible(true);
                  }
                }}
                checked={personType === 'Pessoa Jurídica'}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => {
                if (!profileApproved) navigation.navigate('SelectBank');
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
              editable={!profileApproved && !!selectedBank}
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
            <View style={{ marginTop: padding }}>
              <Text style={{ marginBottom: padding, ...texts.sm, color: colors.grey700 }}>
                {t('Selecione o tipo da sua conta:')}
              </Text>
              {selectedBank?.code === '104' ? (
                <View>
                  {personType === 'Pessoa Física' ? (
                    <View>
                      <RadioButton
                        title={t('001 – Conta Corrente')}
                        onPress={() => {
                          if (!profileApproved) setType('Corrente');
                        }}
                        checked={type === 'Corrente'}
                        style={{ marginBottom: halfPadding }}
                      />
                      <RadioButton
                        title={t('002 – Conta Simples')}
                        onPress={() => {
                          if (!profileApproved) setType('Simples');
                        }}
                        checked={type === 'Simples'}
                        style={{ marginBottom: halfPadding }}
                      />
                      <RadioButton
                        title={t('013 – Conta Poupança')}
                        onPress={() => {
                          if (!profileApproved) setType('Poupança');
                        }}
                        checked={type === 'Poupança'}
                        style={{ marginBottom: halfPadding }}
                      />
                      <RadioButton
                        title={t('1288 – Conta Poupança (novo formato)')}
                        onPress={() => {
                          if (!profileApproved) setType('Nova Poupança');
                        }}
                        checked={type === 'Nova Poupança'}
                      />
                    </View>
                  ) : (
                    <View>
                      <RadioButton
                        title={t('003 – Conta Corrente')}
                        onPress={() => {
                          if (!profileApproved) setType('Corrente');
                        }}
                        checked={type === 'Corrente'}
                        style={{ marginBottom: halfPadding }}
                      />
                      <RadioButton
                        title={t('022 – Conta Poupança')}
                        onPress={() => {
                          if (!profileApproved) setType('Poupança');
                        }}
                        checked={type === 'Poupança'}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <RadioButton
                    title={t('Conta-Corrente')}
                    onPress={() => {
                      if (!profileApproved) setType('Corrente');
                    }}
                    checked={type === 'Corrente'}
                    style={{ marginBottom: halfPadding }}
                  />
                  <RadioButton
                    title={t('Poupança')}
                    onPress={() => {
                      if (!profileApproved) setType('Poupança');
                    }}
                    checked={type === 'Poupança'}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                marginTop: padding,
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
                mask={accountMask}
                parser={accountParser}
                formatter={accountFormatter}
                editable={!profileApproved && !!selectedBank}
                keyboardType={
                  (selectedBank?.accountPattern.indexOf('X') ?? -1) > -1 ? 'default' : 'number-pad'
                }
                returnKeyType="next"
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
          {!profileApproved && (
            <SafeAreaView>
              <DefaultButton
                title={t('Avançar')}
                disabled={!canSubmit}
                activityIndicator={busy}
                onPress={submitBankHandler}
              />
            </SafeAreaView>
          )}
          <BankModal modalVisible={modalVisible} onModalClose={() => setModalVisible(false)} />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
