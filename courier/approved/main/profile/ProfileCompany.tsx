import { CourierCompany } from '@appjusto/types';
import * as cnpjutils from '@fnando/cnpj';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { toNumber, trim } from 'lodash';
import React from 'react';
import { ActivityIndicator, Keyboard, Linking, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import {
  cepFormatter,
  cepMask,
  cnpjFormatter,
  cnpjMask,
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import * as viacep from '../../../../common/store/api/externals/viacep';
import { track, useSegmentScreen } from '../../../../common/store/api/track';
import { getExtra } from '../../../../common/store/config/selectors';
import { getCourier } from '../../../../common/store/courier/selectors';
import { companyInfoSet } from '../../../../common/store/courier/validators';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { AppJustoMEIURL } from '../../../../strings/values';
import { CourierProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<CourierProfileParamList, 'ProfileCompany'>;
type ScreenRouteProp = RouteProp<CourierProfileParamList, 'ProfileCompany'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const api = React.useContext(ApiContext);
  // redux store
  const courier = useSelector(getCourier)!;
  const testing = useSelector(getExtra).environment !== 'live';
  // state
  const [cnpj, setCNPJ] = React.useState(
    courier.company?.cnpj ?? (testing ? cnpjutils.generate() : '')
  );
  const [name, setName] = React.useState(courier.company?.name ?? '');
  const [cep, setCEP] = React.useState<string>(courier.company?.cep ?? '');
  const [address, setAddress] = React.useState(courier.company?.address ?? '');
  const [number, setNumber] = React.useState(courier.company?.number ?? '');
  const [additional, setAdditional] = React.useState(courier.company?.additional ?? '');
  const [city, setCity] = React.useState(courier.company?.city ?? '');
  const [state, setState] = React.useState(courier.company?.state ?? '');
  const [focusedField, setFocusedField] = React.useState<string>();
  const [isLoading, setLoading] = React.useState(false);
  const company: CourierCompany = {
    cnpj,
    name: trim(name),
    cep,
    address: trim(address),
    number,
    city,
    state,
    additional: trim(additional),
  };
  const canSubmit = companyInfoSet(company);
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const cepRef = React.useRef<TextInput>(null);
  const numberRef = React.useRef<TextInput>(null);
  const additionalRef = React.useRef<TextInput>(null);
  // side effects
  // tracking
  useSegmentScreen('ProfileCompany');
  // updating fields after cep query
  React.useEffect(() => {
    if (cep.length === 8 && cepRef.current?.isFocused()) {
      (async () => {
        setLoading(true);
        const result = await viacep.fetchPostalDetails(cep);
        setLoading(false);
        if (!result.error) {
          setAddress(result.logradouro);
          setCity(result.localidade);
          setState(result.uf);
          numberRef.current?.focus();
        }
      })();
    }
  }, [cep]);

  // handlers
  const updateProfileHandler = async () => {
    Keyboard.dismiss();
    setLoading(true);
    await api.profile().updateProfile(courier.id, { company });
    track('courier updated profile with company info');
    setLoading(false);
    navigation.goBack();
  };
  // UI
  if (!courier) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      extraScrollHeight={64}
    >
      <PaddedView style={{ flex: 1 }}>
        <Text style={{ ...texts.x2l }}>{t('Dados da empresa')}</Text>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}>
          {t('Preencha com os dados do seu MEI ou empresa')}
        </Text>
        <PatternInput
          style={{ marginTop: 24 }}
          mask={cnpjMask}
          parser={numbersOnlyParser}
          formatter={cnpjFormatter}
          title={t('CNPJ')}
          placeholder={t('Digite o CNPJ da empresa')}
          value={cnpj}
          keyboardType="decimal-pad"
          returnKeyType="next"
          blurOnSubmit={false}
          onFocus={() => setFocusedField('cnpj')}
          onBlur={() => setFocusedField(undefined)}
          onChangeText={(text) => {
            if (!isNaN(toNumber(text))) setCNPJ(text);
          }}
          onSubmitEditing={() => nameRef.current?.focus()}
          editable={courier.situation !== 'approved'}
        />
        <DefaultInput
          ref={nameRef}
          style={{ marginTop: padding }}
          title={t('Razão Social')}
          placeholder={t('Digite a razão social da empresa')}
          value={name}
          returnKeyType="next"
          blurOnSubmit={false}
          onChangeText={setName}
          onSubmitEditing={() => cepRef.current?.focus()}
          keyboardType="default"
          autoCapitalize="characters"
          editable={courier.situation !== 'approved'}
        />
        <PatternInput
          mask={cepMask}
          parser={numbersOnlyParser}
          formatter={cepFormatter}
          ref={cepRef}
          style={{ marginTop: padding }}
          title={t('CEP')}
          placeholder={t('Digite o CEP da empresa')}
          value={cep}
          returnKeyType="next"
          onChangeText={(text) => {
            if (!isNaN(toNumber(text))) setCEP(text);
          }}
          keyboardType="decimal-pad"
          editable={courier.situation !== 'approved'}
        />
        <DefaultInput
          style={{ marginTop: padding }}
          title={t('Endereço')}
          placeholder={t('Endereço')}
          value={address}
          returnKeyType="next"
          blurOnSubmit={false}
          onChangeText={setAddress}
          onSubmitEditing={() => numberRef.current?.focus()}
          keyboardType="default"
          editable={courier.situation !== 'approved'}
        />
        <View style={{ flexDirection: 'row', marginTop: padding }}>
          <DefaultInput
            ref={numberRef}
            style={{ flex: 1 }}
            title={t('Número')}
            value={number}
            placeholder={t('000')}
            keyboardType="phone-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={setNumber}
            onSubmitEditing={() => additionalRef.current?.focus()}
            editable={courier.situation !== 'approved'}
          />
          <DefaultInput
            ref={additionalRef}
            style={{ marginLeft: padding, flex: 3 }}
            title={t('Complemento')}
            value={additional}
            placeholder={t('Sem complemento')}
            maxLength={9}
            keyboardType="default"
            returnKeyType="next"
            blurOnSubmit
            onChangeText={setAdditional}
            editable={courier.situation !== 'approved'}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: padding }}>
          <DefaultInput
            style={{ flex: 3 }}
            title={t('Cidade')}
            placeholder={t('Cidade')}
            value={city}
            returnKeyType="next"
            onChangeText={setCity}
            keyboardType="default"
            editable={courier.situation !== 'approved'}
          />
          <DefaultInput
            style={{ flex: 1, marginLeft: padding }}
            title={t('Estado')}
            placeholder={t('UF')}
            value={state}
            maxLength={2}
            returnKeyType="next"
            onChangeText={setState}
            keyboardType="default"
            editable={courier.situation !== 'approved'}
          />
        </View>
        {cnpj.length > 0 && !cnpjutils.isValid(cnpj) && focusedField !== 'cnpj' && (
          <Text style={{ ...texts.sm, ...texts.bold, color: colors.grey700, marginTop: padding }}>
            {t('O CNPJ digitado não é válido.')}
          </Text>
        )}
        <View style={{ flex: 1 }} />
        {courier.situation !== 'approved' ? (
          <View style={{ marginTop: padding }}>
            <DefaultButton
              title={t('Avançar')}
              onPress={updateProfileHandler}
              disabled={!canSubmit || isLoading}
              activityIndicator={isLoading}
            />
            <DefaultButton
              title={t('Não tem MEI? Clique aqui e saiba mais')}
              grey
              style={{ marginTop: padding }}
              onPress={() => {
                Linking.openURL(AppJustoMEIURL);
              }}
            />
          </View>
        ) : null}
      </PaddedView>
    </KeyboardAwareScrollView>
  );
}
