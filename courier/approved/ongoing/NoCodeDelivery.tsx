import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Issue, WithId } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'NoCodeDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'NoCodeDelivery'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const NoCodeDelivery = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues('no-code-delivery');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [isLoading, setLoading] = React.useState(false);
  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // UI handlers
  const confirmHandler = () => {
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().createIssue(orderId, {
          issue: selectedIssue,
        });
        setLoading(false);
        navigation.navigate('OngoingDelivery', { orderId, completeWithoutConfirmation: true });
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  return (
    <PaddedView style={{ ...screens.config }}>
      <View style={{ flex: 1 }} />
      <IconMotocycle />
      <Text style={{ ...texts.x2l }}>{t('Escolha o motivo da confirmação sem código:')}</Text>
      <View style={{ marginTop: padding }}>
        {issues?.map((issue) => (
          <RadioButton
            key={issue.id}
            title={issue.title}
            onPress={() => setSelectedIssue(issue)}
            checked={selectedIssue?.id === issue.id}
            style={{ marginBottom: padding }}
          />
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <DefaultButton
        title={t('Confirmar entrega')}
        onPress={confirmHandler}
        disabled={isLoading || !selectedIssue}
        activityIndicator={isLoading}
      />
    </PaddedView>
  );
};
