import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WithId } from 'appjusto-types';
import { Issue } from 'appjusto-types/order/issues';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../common/components/buttons/RadioButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import FeedbackView from '../../../common/components/views/FeedbackView';
import useIssues from '../../../common/store/api/platform/hooks/useIssues';
import { showToast } from '../../../common/store/ui/actions';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { OrderNavigatorParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<OrderNavigatorParamList, 'OrderComplaint'>;
type ScreenRouteProp = RouteProp<OrderNavigatorParamList, 'OrderComplaint'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues('consumer-delivery-problem');
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [comment, setComment] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [isSent, setSent] = React.useState(false);
  // UI
  if (!issues) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }
  if (isSent) {
    return (
      <PaddedView style={{ ...screens.config }}>
        <View style={{ flex: 1, ...borders.default }} />
        <FeedbackView
          header={t('Obrigado pelas informações. Iremos analisar o ocorrido.')}
          icon={icons.motocycle}
          background={colors.lightGrey}
        />
        <View style={{ flex: 1, ...borders.default }} />
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.navigate('Home')}
        />
      </PaddedView>
    );
  }
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
  return (
    <View style={{ ...screens.config, flex: 1 }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        <PaddedView>
          <Text style={{ ...texts.mediumToBig, marginBottom: padding }}>
            {t('Indique seu problema:')}
          </Text>
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
              ...texts.mediumToBig,
              color: colors.darkGrey,
              marginTop: 24,
              marginBottom: halfPadding,
            }}
          >
            {t('Você pode detalhar mais seu problema:')}
          </Text>
          <DefaultInput
            style={{ height: 82 }}
            placeholder={t('Escreva sua mensagem')}
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
            blurOnSubmit
          />
        </PaddedView>
        <View style={{ flex: 1 }} />
        <View style={{ backgroundColor: colors.white, padding }}>
          <DefaultButton
            title={t('Enviar')}
            onPress={complaintHandler}
            activityIndicator={isLoading}
            disabled={!selectedIssue || isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
