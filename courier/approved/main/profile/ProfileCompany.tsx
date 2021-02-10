import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourierCompany } from 'appjusto-types/courier';
import { toNumber, trim } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { TextInput, View } from 'react-native';
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
import { getCourier } from '../../../../common/store/courier/selectors';
import { companyInfoSet } from '../../../../common/store/courier/validators';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
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
  // state
  const [cnpj, setCNPJ] = React.useState(courier.company?.cnpj ?? '');
  const [name, setName] = React.useState(courier.company?.name ?? '');
  const [cep, setCEP] = React.useState<string>(courier.company?.cep ?? '');
  const [address, setAddress] = React.useState(courier.company?.address ?? '');
  const [number, setNumber] = React.useState(courier.company?.number ?? '');
  const [additional, setAdditional] = React.useState(courier.company?.additional ?? '');
  const [city, setCity] = React.useState(courier.company?.city ?? '');
  const [state, setState] = React.useState(courier.company?.state ?? '');
  const [isLoading, setLoading] = React.useState(false);
  const company: CourierCompany = useMemo(
    () => ({
      cnpj,
      name: trim(name),
      cep,
      address: trim(address),
      number,
      city,
      state,
      additional: trim(additional),
    }),
    [cnpj, name, cep, address, number, city, state, additional]
  );
  const canSubmit = useMemo(() => companyInfoSet({ company }), [company]);
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const cepRef = React.useRef<TextInput>(null);
  const numberRef = React.useRef<TextInput>(null);
  const additionalRef = React.useRef<TextInput>(null);
  // effects
  useEffect(() => {
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
    setLoading(true);
    await api.profile().updateProfile(courier.id, { company });
    setLoading(false);
    navigation.goBack();
  };

  // UI
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <PaddedView>
          <PatternInput
            mask={cnpjMask}
            parser={numbersOnlyParser}
            formatter={cnpjFormatter}
            title={t('CNPJ')}
            placeholder={t('Digite o CNPJ da empresa')}
            value={cnpj}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => {
              if (!isNaN(toNumber(text))) setCNPJ(text);
            }}
            onSubmitEditing={() => nameRef.current?.focus()}
            keyboardType="decimal-pad"
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
          />
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              ref={numberRef}
              style={{ flex: 2 }}
              title={t('Número')}
              value={number}
              placeholder={t('000')}
              keyboardType="phone-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={setNumber}
              onSubmitEditing={() => additionalRef.current?.focus()}
            />
            <DefaultInput
              ref={additionalRef}
              style={{ flex: 4, marginLeft: padding }}
              title={t('Complemento')}
              value={additional}
              placeholder={t('Sem complemento')}
              maxLength={9}
              keyboardType="default"
              returnKeyType="done"
              blurOnSubmit
              onChangeText={setAdditional}
            />
          </View>
          <View style={{ flexDirection: 'row', marginTop: padding }}>
            <DefaultInput
              style={{ flex: 8 }}
              title={t('Cidade')}
              placeholder={t('Cidade')}
              value={city}
              returnKeyType="done"
              onChangeText={setCity}
              keyboardType="default"
            />
            <DefaultInput
              style={{ flex: 2, marginLeft: padding }}
              title={t('Estado')}
              placeholder={t('UF')}
              value={state}
              maxLength={2}
              returnKeyType="done"
              onChangeText={setState}
              keyboardType="default"
            />
          </View>
          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Atualizar')}
            onPress={updateProfileHandler}
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
