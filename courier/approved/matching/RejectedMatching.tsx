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
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { MatchingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MatchingParamList, 'RejectedMatching'>,
  StackNavigationProp<ApprovedParamList, 'MatchingNavigator'>
>;
type ScreenRouteProp = RouteProp<MatchingParamList, 'RejectedMatching'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const RejectedMatching = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues('courier-rejects-matching');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [comment, setComment] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  // handler
  const issueHandler = () => {
    Keyboard.dismiss();
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().rejectOrder(orderId, selectedIssue!, comment);
        navigation.replace('RejectedMatchingFeedback');
        setLoading(false);
      } catch (error) {
        setLoading(false);
        dispatch(showToast(t('Não foi possível enviar a razão. Tente novamente.'), 'error'));
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
        title={t('Por que você rejeitou a corrida?')}
        inputHeader={t(
          'Você pode usar o espaço abaixo para detalhar mais sua recusa, dessa forma conseguiremos melhorar nossos serviços:'
        )}
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
