import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId } from 'appjusto-types';
import { Issue } from 'appjusto-types/order/issues';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconMotocycle } from '../../../common/icons/icon-motocycle';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { showToast } from '../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import SingleHeader from '../../../consumer/home/restaurants/SingleHeader';
import { t } from '../../../strings';
import { OngoingParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OngoingParamList, 'CourierDeliveryProblem'>;
type ScreenRoute = RouteProp<OngoingParamList, 'CourierDeliveryProblem'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues('courier-delivery-problem');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [comment, setComment] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [isSent, setSent] = React.useState(false);
  // UI handlers
  const complaintHandler = () => {
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().createIssue(orderId, {
          issue: selectedIssue,
          comment,
        });
        setLoading(false);
        setSent(true);
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar a reclamação. Tente novamente.')));
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
  if (isSent) {
    return (
      <FeedbackView
        header={t('Aguarde enquanto estamos analisando o seu problema')}
        description={t(
          'Em breve entraremos em contato com você para relatar a resolução do seu problema.'
        )}
        icon={<IconMotocycle />}
      >
        <DefaultButton title={t('Voltar')} onPress={() => navigation.goBack()} />
      </FeedbackView>
    );
  }
  return (
    <View style={{ ...screens.config }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <PaddedView style={{ flex: 1 }}>
          <Text style={{ ...texts.x2l, marginBottom: padding }}>{t('Qual foi seu problema?')}</Text>
          {issues.map((issue) => (
            <RadioButton
              key={issue.id}
              title={issue.title}
              onPress={() => setSelectedIssue(issue)}
              checked={selectedIssue?.id === issue.id}
            />
          ))}
          <Text
            style={{
              ...texts.sm,
              color: colors.grey700,
              marginTop: 24,
              marginBottom: halfPadding,
            }}
          >
            {t('Você pode detalhar mais seu problema:')}
          </Text>
          <DefaultInput
            style={{ flex: 1 }}
            placeholder={t('Escreva sua mensagem')}
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
            blurOnSubmit
          />
        </PaddedView>
        <View style={{ flex: 3 }} />
        <PaddedView>
          <DefaultButton
            title={t('Enviar')}
            onPress={complaintHandler}
            activityIndicator={isLoading}
            disabled={!selectedIssue || isLoading}
          />
        </PaddedView>
        <View style={{ backgroundColor: colors.white }}>
          <SingleHeader title={t('Estou com um problema urgente')} />
          <PaddedView>
            <DefaultButton
              title={t('Iniciar suport com o AppJusto')}
              secondary
              onPress={() => null}
            />
          </PaddedView>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
