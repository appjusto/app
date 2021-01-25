import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId } from 'appjusto-types';
import { Issue } from 'appjusto-types/order/issues';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import useIssues from '../../../common/hooks/queries/useIssues';
import { sendCourierOrderProblem } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import SingleHeader from '../../../consumer/home/restaurants/SingleHeader';
import { t } from '../../../strings';
import { OngoingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OngoingParamList, 'CourierDeliveryProblem'>;
type ScreenRoute = RouteProp<OngoingParamList, 'CourierDeliveryProblem'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // app state
  const busy = useSelector(getUIBusy);
  // state
  const issues = useIssues('courier-delivery-problem');
  const [selectedProblem, setSelectedProblem] = React.useState<WithId<Issue>>();
  const [complaintComment, setComplaintComment] = React.useState<string>('');

  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  //handlers
  const complaintHandler = () => {
    if (!selectedProblem) return;
    (async () => {
      try {
        await dispatch(
          sendCourierOrderProblem(api)(orderId, {
            reason: selectedProblem,
            comment: complaintComment,
          })
        );
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar o comentário')));
      }
      console.log(complaintComment);
      console.log(orderId);
      navigation.goBack();
    })();
  };
  return (
    <View style={{ ...screens.config }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <PaddedView style={{ flex: 1 }}>
          <Text style={{ ...texts.big, marginBottom: padding }}>{t('Qual foi seu problema?')}</Text>
          {issues.map((issue) => (
            <RadioButton
              key={issue.id}
              title={issue.title}
              onPress={() => setSelectedProblem(issue)}
              checked={selectedProblem?.id === issue.id}
            />
          ))}
          <Text
            style={{
              ...texts.default,
              color: colors.darkGrey,
              marginTop: 24,
              marginBottom: halfPadding,
            }}
          >
            {t('Você pode detalhar mais seu problema:')}
          </Text>
          <DefaultInput
            style={{ flex: 1 }}
            placeholder={t('Escreva sua mensagem')}
            multiline
            numberOfLines={6}
            value={complaintComment}
            onChangeText={setComplaintComment}
            textAlignVertical="top"
            blurOnSubmit
          />
        </PaddedView>
        <View style={{ flex: 3 }} />
        <PaddedView>
          <DefaultButton
            title={t('Enviar')}
            onPress={complaintHandler}
            activityIndicator={busy}
            disabled={!selectedProblem || busy}
          />
        </PaddedView>
        <View style={{ backgroundColor: colors.white }}>
          <SingleHeader title={t('Estou com um problema urgente')} />
          <PaddedView>
            <DefaultButton
              title={t('Iniciar suport com o AppJusto')}
              secondary
              onPress={() => null}
            />
          </PaddedView>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
