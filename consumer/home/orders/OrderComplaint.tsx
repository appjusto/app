import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId, OrderComplaintSurvey, ComplaintDescription } from 'appjusto-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';

import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import { documentAs } from '../../../common/store/api/types';
import { getCourier } from '../../../common/store/courier/selectors';
import { sendOrderComplaint } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
// import { OrderComplaintSurvey } from '../../../common/store/user/types';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HistoryParamList } from '../../history/types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'OrderComplaint'>;
type ScreenRouteProp = RouteProp<HistoryParamList, 'OrderComplaint'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  //context
  const { order } = route.params;
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  //app state
  const courier = useSelector(getCourier)!;
  const busy = useSelector(getUIBusy);
  const fetchProblems = (key: string) => api.order().fetchProblems();
  const query = useQuery('delivery-problems', fetchProblems);
  const [problems, setProblems] = useState<WithId<OrderComplaintSurvey>[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<WithId<OrderComplaintSurvey>>();
  const [complaintComment, setComplaintComment] = useState<string>('');

  //handlers (needs async useCallback to register the complaint in the firestore)
  const complaintHandler = useCallback(() => {
    (async () => {
      try {
        await dispatch(
          sendOrderComplaint(api)(order.id, {
            description: complaintComment,
          })
        );
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar o comentário')));
      }
      console.log(complaintComment);
      console.log(order.id);
      navigation.popToTop();
    })();
  }, [order, selectedProblem, complaintComment]);

  // side effects
  // whenever data changes
  useEffect(() => {
    if (query.data) {
      setProblems(documentAs<OrderComplaintSurvey>(query.data));
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
    <KeyboardAwareScrollView style={{ ...screens.config }}>
      <View style={{ flex: 1 }}>
        <PaddedView>
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
        <PaddedView style={{ backgroundColor: colors.white }}>
          <DefaultButton title={t('Enviar')} onPress={complaintHandler} activityIndicator={busy} />
        </PaddedView>
      </View>
    </KeyboardAwareScrollView>
  );
}
