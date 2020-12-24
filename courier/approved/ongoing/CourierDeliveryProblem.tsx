import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId } from 'appjusto-types';
import { Issue } from 'appjusto-types/order/issues';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import useIssues from '../../../common/hooks/queries/useIssues';
import { documentsAs } from '../../../common/store/api/types';
import { sendCourierOrderProblem } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { OngoingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OngoingParamList, 'CourierDeliveryProblem'>;
type ScreenRoute = RouteProp<OngoingParamList, 'CourierDeliveryProblem'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  //context
  const { orderId } = route.params;
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  //app state
  const busy = useSelector(getUIBusy);
  const query = useIssues('courier-delivery-problem');
  const [problems, setProblems] = useState<WithId<Issue>[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<WithId<Issue>>();
  const [complaintComment, setComplaintComment] = useState<string>('');

  //handlers
  const complaintHandler = useCallback(() => {
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
  }, [orderId, selectedProblem, complaintComment]);

  // side effects
  // whenever data changes
  useEffect(() => {
    if (query.data) {
      setProblems(documentsAs<Issue>(query.data));
    }
    // console.log(problems);
  }, [query.data]);

  if (problems.length === 0)
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  return (
    <View style={{ ...screens.config }}>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <PaddedView style={{ flex: 1 }}>
          <Text style={{ ...texts.mediumToBig, marginBottom: padding }}>
            {t('Indique seu problema:')}
          </Text>
          {problems.map((problem) => (
            <RadioButton
              key={problem.id}
              title={problem.title}
              onPress={() => setSelectedProblem(problem)}
              checked={selectedProblem?.id === problem.id}
            />
          ))}
          <Text
            style={{
              ...texts.mediumToBig,
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
        <View style={{ flex: 1 }} />
        <PaddedView style={{ backgroundColor: colors.white, flex: 1 }}>
          <DefaultButton
            title={t('Enviar')}
            onPress={complaintHandler}
            activityIndicator={busy}
            disabled={!selectedProblem || busy}
          />
        </PaddedView>
      </KeyboardAwareScrollView>
    </View>
  );
}
