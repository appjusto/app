import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ConsumerProfile } from 'appjusto-types';
import { trim } from 'lodash';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import DefaultInput from '../../common/components/inputs/DefaultInput';
import { cpfFormatter, cpfMask } from '../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../common/components/inputs/PatternInput';
import { getConsumer } from '../../common/store/consumer/selectors';
import { consumerInfoSet } from '../../common/store/consumer/validators';
import { getUIBusy } from '../../common/store/ui/selectors';
import { updateProfile } from '../../common/store/user/actions';
import { padding, screens } from '../../common/styles';
import { t } from '../../strings';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileEdit'>;
type ScreenRouteProp = RouteProp<ProfileParamList, 'ProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // refs
  const nameRef = useRef<TextInput>(null);
  const surnameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);

  // app state
  const busy = useSelector(getUIBusy);
  const consumer = useSelector(getConsumer)!;

  // state
  const [email, setEmail] = useState<string>(consumer.email ?? '');
  const [name, setName] = useState<string>(consumer.name ?? '');
  const [surname, setSurname] = useState(consumer.surname ?? '');
  const [cpf, setCpf] = useState(consumer.cpf! ?? '');
  const updatedConsumer: Partial<ConsumerProfile> = useMemo(() => ({ name, surname, cpf }), [
    name,
    surname,
    cpf,
  ]);
  const canSubmit = useMemo(() => consumerInfoSet(updatedConsumer), [updatedConsumer]);

  // handlers
  const updateProfileHandler = async () => {
    await dispatch(updateProfile(api)(consumer.id, updatedConsumer));
    navigation.goBack();
  };

  // UI
  return (
    <View style={screens.config}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <PaddedView>
          <DefaultInput
            title={t('E-mail')}
            placeholder={t('Digite seu e-mail')}
            value={email}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => nameRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
          />
          <DefaultInput
            ref={nameRef}
            style={{ marginTop: padding }}
            title={t('Nome')}
            placeholder={t('Digite seu nome')}
            value={name}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setName(text)}
            onSubmitEditing={() => surnameRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
          />
          <DefaultInput
            ref={surnameRef}
            style={{ marginTop: padding }}
            title={t('Sobrenome')}
            placeholder={t('Digite seu sobrenome')}
            value={surname}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setSurname(text)}
            onSubmitEditing={() => cpfRef.current?.focus()}
            keyboardType="default"
            maxLength={30}
          />
          <PatternInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF')}
            value={cpf}
            placeholder={t('Seu CPF, apenas números')}
            mask={cpfMask}
            parser={numbersOnlyParser}
            formatter={cpfFormatter}
            keyboardType="number-pad"
            returnKeyType="done"
            blurOnSubmit={false}
            onChangeText={(text) => setCpf(trim(text))}
          />
          <DefaultButton
            style={{ marginTop: padding }}
            title={t('Atualizar')}
            onPress={updateProfileHandler}
            disabled={!canSubmit || busy}
            activityIndicator={busy}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
