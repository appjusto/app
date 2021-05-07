import { Issue, WithId } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { cancelOrder } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, padding, screens, texts } from '../../../common/styles';
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
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues('consumer-cancel');
  const [selectedReason, setSelectedReason] = React.useState<WithId<Issue>>();
  const [rejectionComment, setRejectionComment] = React.useState<string>('');
  const [isLoading, setLoading] = React.useState(false);
  const [isCanceled, setCanceled] = React.useState(false);
  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  if (isCanceled) {
    return (
      <FeedbackView
        header={t('Obrigado pelas informações. Seu pedido foi cancelado.')}
        description={t('Você pode ver as informações desse pedido no seu Histórico de Pedidos.')}
        icon={<IconMotocycle />}
      >
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.replace('MainNavigator', { screen: 'Home' })}
          secondary
        />
      </FeedbackView>
    );
  }
  // handlers
  const cancelHandler = () => {
    (async () => {
      try {
        setLoading(true);
        await dispatch(
          cancelOrder(api)(orderId, {
            issue: selectedReason!,
            comment: rejectionComment,
          })
        );
        setCanceled(true);
      } catch (error) {
        dispatch(showToast(error.toString()));
      }
      setLoading(false);
    })();
  };
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ ...screens.config }}
    >
      <PaddedView>
        <Text style={{ ...texts.x2l, marginBottom: padding }}>
          {t('Por que você está cancelando o seu pedido?')}
        </Text>
        {issues.map((issue) => (
          <RadioButton
            key={issue.id}
            title={issue.title}
            checked={selectedReason?.id === issue.id}
            onPress={() => setSelectedReason(issue)}
          />
        ))}
        <Text style={{ ...texts.xs, marginBottom: padding, marginTop: padding }}>
          {t(
            'Você pode usar o espaço abaixo para detalhar mais o cancelamento. Dessa forma conseguiremos melhorar nossos serviços:'
          )}
        </Text>
        <TextInput
          placeholder={t('Escreva sua mensagem')}
          style={{
            width: '100%',
            height: 128,
            ...borders.default,
            borderColor: colors.grey500,
            backgroundColor: colors.white,
            padding: 8,
          }}
          multiline
          onChangeText={setRejectionComment}
          value={rejectionComment}
          textAlignVertical="top"
          blurOnSubmit
        />
        <View style={{ flex: 1 }} />
        <DefaultButton
          style={{ marginTop: padding }}
          title={t('Enviar')}
          onPress={cancelHandler}
          disabled={!selectedReason || isLoading}
          activityIndicator={isLoading}
        />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
