import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ConsumerProfile } from 'appjusto-types';
import { trim } from 'lodash';
import React, { useState, useContext, useRef, useMemo } from 'react';
import { View, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, ApiContext } from '../../common/app/context';
import DefaultButton from '../../common/components/buttons/DefaultButton';
import PaddedView from '../../common/components/containers/PaddedView';
import DefaultInput from '../../common/components/inputs/DefaultInput';
import { getConsumer } from '../../common/store/consumer/selectors';
import { consumerInfoSet } from '../../common/store/consumer/validators';
import { getUIBusy } from '../../common/store/ui/selectors';
import { updateProfile } from '../../common/store/user/actions';
import { screens, padding } from '../../common/styles';
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
  const surnameRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);

  // app state
  const busy = useSelector(getUIBusy);
  const consumer = useSelector(getConsumer)!;

  // state
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
      <KeyboardAwareScrollView>
        <PaddedView>
          <DefaultInput
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
          <DefaultInput
            ref={cpfRef}
            style={{ marginTop: padding }}
            title={t('CPF')}
            placeholder={t('Seu CPF, apenas números')}
            value={cpf}
            maxLength={11}
            keyboardType="number-pad" // are we going to use "-" and "."?
            returnKeyType="done"
            blurOnSubmit
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
