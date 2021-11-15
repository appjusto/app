import { Issue, WithId } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import RadioButton from '../../../common/components/buttons/RadioButton';
import { ReportIssueView } from '../../../common/components/views/ReportIssueView';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedNavigatorParamList } from '../types';
import { OngoingOrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderCancelOrder'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderCancelOrder'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export const OngoingOrderCancelOrder = ({ route, navigation }: Props) => {
  // params
  const { orderId, acknowledgedCosts, issueType } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues(issueType);
  const [selectedReason, setSelectedReason] = React.useState<WithId<Issue>>();
  const [rejectionComment, setRejectionComment] = React.useState<string>('');
  const [isLoading, setLoading] = React.useState(false);

  // tracking
  useSegmentScreen('OngoingOrderCancelOrder');
  // handlers
  const cancelHandler = () => {
    (async () => {
      Keyboard.dismiss();
      try {
        setLoading(true);
        await api.order().cancelOrder(orderId, acknowledgedCosts, selectedReason, rejectionComment);
        setLoading(false);
        navigation.replace('OngoingOrderCancelFeedback');
      } catch (error) {
        setLoading(false);
        dispatch(showToast('Não foi possível efetuar o cancelamento. Tente novamente', 'error'));
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
        title={t('Por que você está cancelando seu pedido?')}
        inputHeader={t('Você pode usar o espaço abaixo para detalhar mais seu problema:')}
        comment={rejectionComment}
        setComment={(text) => setRejectionComment(text)}
        disabled={!selectedReason || isLoading}
        onSendIssue={cancelHandler}
        isLoading={isLoading}
        submitTitle={t('Cancelar')}
      >
        {issues.map((issue) => (
          <View style={{ marginBottom: padding }} key={issue.id}>
            <RadioButton
              title={issue.title}
              onPress={() => setSelectedReason(issue)}
              checked={selectedReason?.id === issue.id}
            />
          </View>
        ))}
      </ReportIssueView>
    </View>
  );
};
