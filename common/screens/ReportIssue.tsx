import { Issue, IssueType } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { DeliveredOrderNavigatorParamList } from '../../consumer/v2/delivered/types';
import { OngoingOrderNavigatorParamList } from '../../consumer/v2/ongoing/types';
import { LoggedNavigatorParamList } from '../../consumer/v2/types';
import { OngoingDeliveryNavigatorParamList } from '../../courier/approved/ongoing/types';
import { ApprovedParamList } from '../../courier/approved/types';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import RadioButton from '../components/buttons/RadioButton';
import { ReportIssueView } from '../components/views/ReportIssueView';
import useIssues from '../store/api/platform/hooks/useIssues';
import { track, useSegmentScreen } from '../store/api/track';
import { getFlavor } from '../store/config/selectors';
import { showToast } from '../store/ui/actions';
import { getUser } from '../store/user/selectors';
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
  const user = useSelector(getUser)!;
  const flavor = useSelector(getFlavor);
  const issues = useIssues(issueType);
  const [selectedIssue, setSelectedIssue] = React.useState<Issue>();
  const [comment, setComment] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // tracking
  useSegmentScreen('ReportIssue', {
    issueType,
  });

  const title = (() => {
    if (
      issueType === 'courier-delivering-food-order' ||
      issueType === 'courier-delivering-p2p-order'
    ) {
      return t('Qual o problema que você teve ao transportar o pedido?');
    } else {
      return t('Qual o seu problema?');
    }
  })();
  // handlers
  const issueHandler = () => {
    if (!selectedIssue) return;
    (async () => {
      Keyboard.dismiss();
      try {
        setLoading(true);
        await api.order().createIssue(orderId, {
          issue: selectedIssue,
          createdBy: user.uid,
          flavor,
          comment,
        });
        track('Reported issue', {
          issue: selectedIssue,
        });
        setLoading(false);
        if (flavor === 'courier') {
          navigation.replace('DeliveryProblemFeedback', {
            issueType,
            orderId,
          });
        } else {
          navigation.replace('OrderProblemFeedback', { orderId });
        }
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar a reclamação. Tente novamente.'), 'error'));
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
  return (
    <View style={{ ...screens.default }}>
      <ReportIssueView
        title={title}
        inputHeader={t('Você pode detalhar mais seu problema:')}
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
  );
};
