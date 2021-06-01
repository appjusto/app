import { Issue, IssueType, WithId } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DeliveredOrderNavigatorParamList } from '../../consumer/v2/delivered/types';
import { OngoingOrderNavigatorParamList } from '../../consumer/v2/ongoing/types';
import { LoggedNavigatorParamList } from '../../consumer/v2/types';
import { OngoingDeliveryNavigatorParamList } from '../../courier/approved/ongoing/types';
import { ApprovedParamList } from '../../courier/approved/types';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import DefaultButton from '../components/buttons/DefaultButton';
import RadioButton from '../components/buttons/RadioButton';
import FeedbackView from '../components/views/FeedbackView';
import { ReportIssueView } from '../components/views/ReportIssueView';
import { IconMotocycle } from '../icons/icon-motocycle';
import useIssues from '../store/api/platform/hooks/useIssues';
import { useSegmentScreen } from '../store/api/track';
import { getCourier } from '../store/courier/selectors';
import { showToast } from '../store/ui/actions';
import { colors, padding, screens } from '../styles';

export type ReportIssueParamList = {
  ReportIssue: {
    issueType: IssueType;
    orderId: string;
  };
};

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    DeliveredOrderNavigatorParamList &
      OngoingOrderNavigatorParamList &
      OngoingDeliveryNavigatorParamList,
    'ReportIssue'
  >,
  StackNavigationProp<ApprovedParamList & LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<ReportIssueParamList, 'ReportIssue'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ReportIssue = ({ route, navigation }: Props) => {
  // params
  const { orderId, issueType } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const courier = useSelector(getCourier)!;
  const issues = useIssues(issueType);
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [comment, setComment] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [issueSent, setIssueSent] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('Report issue', {
    issueType,
  });

  const toastMessage = (() => {
    if (issueType === 'consumer-delivery-problem') {
      return t('Não foi possível enviar a reclamação. Tente novamente.');
    } else if (issueType === 'courier-delivery-problem') {
      return t('Não foi possível enviar a reclamação. Tente novamente.');
    } else {
      return '';
    }
  })();
  const feedbackHeaderTitle = (() => {
    if (issueType === 'consumer-delivery-problem') {
      return t('Obrigado pelas informações. Iremos analisar o ocorrido.');
    } else if (issueType === 'courier-delivery-problem') {
      return t('Aguarde enquanto estamos analisando o seu problema.');
    } else {
      return '';
    }
  })();
  const feedbackDescription = (() => {
    if (issueType === 'consumer-delivery-problem') {
      return undefined;
    } else if (issueType === 'courier-delivery-problem') {
      return t('Em breve entraremos em contato com você para relatar a resolução do seu problema.');
    } else {
      return undefined;
    }
  })();
  const title = (() => {
    if (issueType === 'courier-delivery-problem') {
      return t('Qual o problema que você teve ao transportar o pedido?');
    } else {
      return t('Qual o seu problema?');
    }
  })();
  const inputHeader = (() => {
    return t('Você pode detalhar mais seu problema:');
  })();
  // handlers
  const issueHandler = () => {
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().createIssue(orderId, {
          issue: selectedIssue,
          comment,
        });
        navigation.replace('DeliveryProblemNavigator', {
          screen: 'DeliveryProblemFeedback',
          params: { issueType, orderId },
        });
        setLoading(false);
        // setIssueSent(true);
      } catch (error) {
        dispatch(showToast(toastMessage));
      }
    })();
  };
  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // add right header and description for each case
  if (issueSent) {
    return (
      <FeedbackView
        header={feedbackHeaderTitle}
        icon={<IconMotocycle />}
        background={colors.grey50}
        description={feedbackDescription}
      >
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
        />
      </FeedbackView>
    );
  }
  return (
    <View style={{ ...screens.default }}>
      <ReportIssueView
        title={title}
        inputHeader={inputHeader}
        comment={comment}
        setComment={(text) => setComment(text)}
        disabled={!selectedIssue || isLoading}
        onSendIssue={issueHandler}
        isLoading={isLoading}
      >
        {issues.map((issue) => (
          <View style={{ marginBottom: padding }} key={issue.id}>
            <RadioButton
              title={issue.title}
              onPress={() => setSelectedIssue(issue)}
              checked={selectedIssue?.id === issue.id}
            />
          </View>
        ))}
      </ReportIssueView>
    </View>
    // <KeyboardAwareScrollView
    //   enableOnAndroid
    //   enableAutomaticScroll
    //   keyboardOpeningTime={0}
    //   style={{ ...screens.config }}
    //   keyboardShouldPersistTaps="always"
    //   contentContainerStyle={{ flexGrow: 1 }}
    // >
    //   <PaddedView>
    //     <Text style={{ ...texts.xl, marginBottom: padding }}>{title}</Text>
    //     {issues.map((issue) => (
    //       <View style={{ marginBottom: padding }} key={issue.id}>
    //         <RadioButton
    //           title={issue.title}
    //           onPress={() => setSelectedIssue(issue)}
    //           checked={selectedIssue?.id === issue.id}
    //         />
    //       </View>
    //     ))}
    //     <Text
    //       style={{
    //         ...texts.sm,
    //         marginTop: 24,
    //         marginBottom: halfPadding,
    //       }}
    //     >
    //       {inputHeader}
    //     </Text>
    //     <DefaultInput
    //       style={{ height: 128 }}
    //       placeholder={t('Escreva sua mensagem')}
    //       multiline
    //       value={comment}
    //       onChangeText={setComment}
    //       textAlignVertical="top"
    //       blurOnSubmit
    //     />
    //   </PaddedView>
    //   <View style={{ flex: 1 }} />
    //   <PaddedView>
    //     <DefaultButton
    //       title={t('Enviar')}
    //       onPress={issueHandler}
    //       activityIndicator={isLoading}
    //       disabled={!selectedIssue || isLoading}
    //     />
    //   </PaddedView>
    // </KeyboardAwareScrollView>
  );
};
