import { Issue, WithId } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import RadioButton from '../../../common/components/buttons/RadioButton';
import { ReportIssueView } from '../../../common/components/views/ReportIssueView';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { getCourier } from '../../../common/store/courier/selectors';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '.././../../strings';
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
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues('courier-refuse');
  // const issues = useIssues('courier-drops-delivery');
  const courier = useSelector(getCourier)!;
  const order = useObserveOrder(orderId);
  // screen state
  const [comment, setComment] = React.useState('');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [isLoading, setLoading] = React.useState(false);
  // handlers
  // this handler, just for tests, is  navigating
  //to the DeliveryProblemFeedback. Will use navigation.replace in the end
  const dropOrderHandler = () => {
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().dropOrder(orderId, selectedIssue, comment);
        navigation.replace('DeliveryProblemNavigator', {
          screen: 'DeliveryProblemFeedback',
          params: { issueType: 'courier-refuse', orderId },
        });
      } catch (error) {
        setLoading(false);
        dispatch(showToast(t('Não foi possível enviar o comentário')));
      } finally {
        setLoading(false);
      }
    })();
  };
  console.log(order?.dispatchingStatus);
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
        title={t('Porque você precisa desistir da entrega?')}
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
