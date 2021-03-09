import { StackNavigationProp } from '@react-navigation/stack';
import { ConsumerProfile } from 'appjusto-types';
import { trim } from 'lodash';
import React from 'react';
import { TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import {
  cpfFormatter,
  cpfMask,
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { consumerInfoSet } from '../../../../common/store/consumer/validators';
import { showToast } from '../../../../common/store/ui/actions';
import { padding, screens } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ProfileParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<ProfileParamList, 'ProfileEdit'>;

type Props = {
  navigation: ScreenNavigationProp;
};

export default function ({ navigation }: Props) {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // app state
  const consumer = useSelector(getConsumer)!;
  // state
  const [email, setEmail] = React.useState<string>(consumer.email ?? '');
  const [name, setName] = React.useState<string>(consumer.name ?? '');
  const [surname, setSurname] = React.useState(consumer.surname ?? '');
  const [cpf, setCpf] = React.useState(consumer.cpf! ?? '');
  const [isLoading, setLoading] = React.useState(false);
  const updatedConsumer: Partial<ConsumerProfile> = { name, surname, cpf };
  const canSubmit = consumerInfoSet(updatedConsumer);
  // handlers
  const updateProfileHandler = async () => {
    try {
      setLoading(true);
      api.profile().updateProfile(consumer.id, updatedConsumer);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      dispatch(showToast(t('Não foi possível atualizar o perfil.'), 'error'));
    }
  };
  // refs
  const nameRef = React.useRef<TextInput>(null);
  const surnameRef = React.useRef<TextInput>(null);
  const cpfRef = React.useRef<TextInput>(null);
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
            editable={false}
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
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
