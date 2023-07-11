import { ContactBy } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import React from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import PatternInput from '../../../../common/components/inputs/PatternInput';
import {
  dateFormatter,
  dateMask,
} from '../../../../common/components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../../../common/components/inputs/pattern-input/parsers';
import { track } from '../../../../common/store/api/track';
import { getFlavor } from '../../../../common/store/config/selectors';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { getCourier } from '../../../../common/store/courier/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { getUser } from '../../../../common/store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ApprovedParamList } from '../../types';

type ScreenNavigationProp = StackNavigationProp<ApprovedParamList, 'ComplaintScreen'>;

type ScreenRouteProp = RouteProp<ApprovedParamList, 'ComplaintScreen'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ComplaintScreen = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params ?? {};
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = React.useContext(ApiContext);
  // redux
  const user = useSelector(getUser)!;
  const flavor = useSelector(getFlavor);
  const consumer = useSelector(getConsumer);
  const courier = useSelector(getCourier);
  const profile = flavor === 'courier' ? courier! : consumer!;
  // refs
  const placeRef = React.useRef<TextInput>(null);
  const againstRef = React.useRef<TextInput>(null);
  const descriptionRef = React.useRef<TextInput>(null);
  // state
  const [date, setDate] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [against, setAgainst] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contactBy, setContactBy] = React.useState<ContactBy>('whatsapp');
  const [isLoading, setLoading] = React.useState(false);
  const canSubmit = description.length > 0;
  // handlers
  const submitHandler = () => {
    (async () => {
      Keyboard.dismiss();
      try {
        setLoading(true);
        await api.complaints().createComplaint({
          against,
          place,
          date,
          description,
          contactBy,
          orderId: orderId ?? null,
          status: 'pending',
          createdBy: {
            id: user.uid,
            flavor,
            name: profile.name,
          },
          createdAt: serverTimestamp() as Timestamp,
        });
        track('Nova denúncia');
        setLoading(false);
        navigation.replace('ComplaintFeedbackScreen');
      } catch (error) {
        console.log(error);
        setLoading(false);
        dispatch(showToast(t('Não foi possível enviar a denúncia. Tente novamente.'), 'error'));
      }
    })();
  };
  // UI
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
        <Text
          style={{
            ...texts.xl,
            marginBottom: halfPadding,
          }}
        >
          {t('Registre uma denúncia')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            marginBottom: padding,
          }}
        >
          {t(
            'No AppJusto, seus direitos fundamentais serão sempre defendidos. Sua denúncia será registrada de maneira confidencial.\n\nCaso seja necessário, o setor jurídico será acionado para aplicar os termos da lei.'
          )}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: padding }}>
          <PatternInput
            style={{ flex: 1, marginRight: padding }}
            title={t('Data do ocorrido')}
            value={date}
            placeholder={t('00/00')}
            mask={dateMask}
            parser={numbersOnlyParser}
            formatter={dateFormatter}
            keyboardType="number-pad"
            returnKeyType="next"
            onChangeText={setDate}
            onSubmitEditing={() => placeRef.current?.focus()}
          />
          <DefaultInput
            ref={placeRef}
            style={{ flex: 1 }}
            title={t('Local do ocorrido')}
            placeholder={t('Local')}
            value={place}
            returnKeyType="next"
            onChangeText={setPlace}
            onSubmitEditing={() => againstRef.current?.focus()}
          />
        </View>
        <DefaultInput
          ref={againstRef}
          style={{ marginTop: padding }}
          title={t('Nome do denunciado')}
          value={against}
          placeholder={t('Digite o nome do denunciado')}
          keyboardType="default"
          returnKeyType="next"
          onSubmitEditing={() => descriptionRef.current?.focus()}
          onChangeText={setAgainst}
        />
        <DefaultInput
          ref={descriptionRef}
          style={{ marginTop: padding }}
          title={t('Descrição do ocorrido')}
          value={description}
          placeholder={t('Nos conte com detalhes o que aconteceu')}
          keyboardType="default"
          returnKeyType="done"
          blurOnSubmit
          multiline
          numberOfLines={5}
          onChangeText={setDescription}
        />
        <Text style={{ ...texts.md, marginTop: padding }}>Por onde prefere ser contatado?</Text>
        <View style={{ flexDirection: 'row', marginTop: padding }}>
          <RadioButton
            title={t('WhatsApp')}
            onPress={() => setContactBy('whatsapp')}
            checked={contactBy === 'whatsapp'}
            textVariant="v2"
          />
          <RadioButton
            style={{ marginLeft: padding }}
            title={t('E-mail')}
            onPress={() => setContactBy('e-mail')}
            checked={contactBy === 'e-mail'}
            textVariant="v2"
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <DefaultButton
            title="Enviar"
            onPress={submitHandler}
            disabled={!canSubmit || isLoading}
            activityIndicator={isLoading}
            style={{ marginVertical: padding }}
          />
        </View>
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
