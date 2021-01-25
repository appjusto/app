import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId } from 'appjusto-types';
import { Issue } from 'appjusto-types/order/issues';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import FeedbackView from '../../../common/components/views/FeedbackView';
import useIssues from '../../../common/hooks/queries/useIssues';
import { sendOrderProblem } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HomeNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<HomeNavigatorParamList, 'OrderComplaint'>;
type ScreenRouteProp = RouteProp<HomeNavigatorParamList, 'OrderComplaint'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  const { orderId } = route.params;
  // params
  //context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const issues = useIssues('consumer-delivery-problem');

  //app state
  const busy = useSelector(getUIBusy);
  const [selectedProblem, setSelectedProblem] = React.useState<WithId<Issue>>();
  const [complaintComment, setComplaintComment] = React.useState<string>('');
  const [problemSent, setProblemSent] = React.useState<boolean>(false);

  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  if (problemSent) {
    return (
      <PaddedView style={{ ...screens.config }}>
        <View style={{ flex: 1, ...borders.default }} />
        <FeedbackView
          header={t('Obrigado pelas informações. Iremos analisar o ocorrido.')}
          icon={icons.motocycle}
          background={colors.lightGrey}
        />
        <View style={{ flex: 1, ...borders.default }} />
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.navigate('Home')}
          activityIndicator={busy}
        />
      </PaddedView>
    );
  }
  // UI handlers
  const complaintHandler = () => {
    if (!selectedProblem) return;
    (async () => {
      try {
        await dispatch(
          sendOrderProblem(api)(orderId, {
            reason: selectedProblem,
            comment: complaintComment,
          })
        );
        setProblemSent(true);
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar o comentário')));
      }
    })();
  };
  return (
    <View style={{ ...screens.config, flex: 1 }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <PaddedView>
          <Text style={{ ...texts.mediumToBig, marginBottom: padding }}>
            {t('Indique seu problema:')}
          </Text>
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
              ...texts.mediumToBig,
              color: colors.darkGrey,
              marginTop: 24,
              marginBottom: halfPadding,
            }}
          >
            {t('Você pode detalhar mais seu problema:')}
          </Text>
          <DefaultInput
            style={{ height: 82 }}
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
        <View style={{ backgroundColor: colors.white, padding }}>
          <DefaultButton
            title={t('Enviar')}
            onPress={complaintHandler}
            activityIndicator={busy}
            disabled={!selectedProblem || busy}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
