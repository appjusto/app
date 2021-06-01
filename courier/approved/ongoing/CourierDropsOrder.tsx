import { Issue, WithId } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import RadioButton from '../../../common/components/buttons/RadioButton';
import { ReportIssueView } from '../../../common/components/views/ReportIssueView';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
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
  // state
  const issues = useIssues('courier-refuse');
  // screen state
  const [comment, setComment] = React.useState('');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [isLoading, setLoading] = React.useState(false);
  // handlers
  // this handler, for now, just navigates to the feedback screen.
  // we need to call the api method (rejectOrder or the new dropOrder)
  // before this navigation. also change it to "replace"
  const dropOrderHandler = () => {
    navigation.navigate('DeliveryProblemNavigator', {
      screen: 'DeliveryProblemFeedback',
      params: { issueType: 'courier-refuse', orderId },
    });
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
