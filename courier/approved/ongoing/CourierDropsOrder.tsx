import { Issue, WithId } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Keyboard, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import RadioButton from '../../../common/components/buttons/RadioButton';
import { ReportIssueView } from '../../../common/components/views/ReportIssueView';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { track, useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'CourierDropsOrder'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'CourierDropsOrder'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const CourierDropsOrder = ({ navigation, route }: Props) => {
  // params
  const { orderId, issueType } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  // const issues = useIssues('courier-refuse');
  const issues = useIssues(issueType);
  const order = useObserveOrder(orderId);
  // screen state
  const [comment, setComment] = React.useState('');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [isLoading, setLoading] = React.useState(false);
  // tracking
  useSegmentScreen('CourierDropsOrder');
  // handlers
  const dropOrderHandler = () => {
    Keyboard.dismiss();
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().dropOrder(orderId, selectedIssue, comment);
        track('courier dropped order');
        navigation.replace('DropOrderFeedback');
      } catch (error) {
        setLoading(false);
        dispatch(showToast(t('Não foi possível enviar o comentário'), 'error'));
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
        title={t('Por que você precisa desistir da entrega?')}
        inputHeader={t(
          'Você pode usar o espaço abaixo para detalhar mais sua recusa, dessa forma conseguiremos melhorar nossos serviços:'
        )}
        comment={comment}
        setComment={(text) => setComment(text)}
        disabled={!selectedIssue || isLoading}
        onSendIssue={dropOrderHandler}
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
