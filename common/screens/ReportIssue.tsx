import { RouteProp } from '@react-navigation/native';
import { Issue, IssueType, WithId } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { t } from '../../strings';
import { ApiContext, AppDispatch } from '../app/context';
import DefaultButton from '../components/buttons/DefaultButton';
import RadioButton from '../components/buttons/RadioButton';
import PaddedView from '../components/containers/PaddedView';
import DefaultInput from '../components/inputs/DefaultInput';
import FeedbackView from '../components/views/FeedbackView';
import { IconMotocycle } from '../icons/icon-motocycle';
import useIssues from '../store/api/platform/hooks/useIssues';
import { showToast } from '../store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../styles';

export type IssuesParamList = {
  ReportIssue: {
    issueType: IssueType;
    orderId: string;
  };
};

// type ScreenNavigationProp = StackNavigationProp<OrderNavigatorParamList, 'SendIssuesScreen'>;
type ScreenRouteProp = RouteProp<IssuesParamList, 'ReportIssue'>;

type Props = {
  // navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ReportIssue = ({ route, navigation }: Props) => {
  // params
  const { orderId, issueType } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // state
  const issues = useIssues(issueType);
  const [selectedIssue, setSelectedIssue] = React.useState<WithId<Issue>>();
  const [comment, setComment] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [issueSent, setIssueSent] = React.useState(false);

  const toastMessage = (() => {
    if (issueType === 'consumer-delivery-problem') {
      return t('Não foi possível enviar a reclamação. Tente novamente.');
    }
    if (issueType === 'courier-delivery-problem') {
      return t('Não foi possível enviar a reclamação. Tente novamente.');
    } else {
      return '';
    }
  })();
  const headerTitle = (() => {
    if (issueType === 'consumer-delivery-problem') {
      return t('Obrigado pelas informações. Iremos analisar o ocorrido.');
    }
    if (issueType === 'courier-delivery-problem') {
      return t('Aguarde enquanto estamos analisando o seu problema.');
    } else {
      return '';
    }
  })();
  const feedbackDescription = (() => {
    if (issueType === 'consumer-delivery-problem') {
      return undefined;
    }
    if (issueType === 'courier-delivery-problem') {
      return t('Em breve entraremos em contato com você para relatar a resolução do seu problema.');
    } else {
      return undefined;
    }
  })();
  // handlers
  const issueHandler = () => {
    if (!selectedIssue) return;
    (async () => {
      try {
        setLoading(true);
        await api.order().createIssue(orderId, {
          issue: selectedIssue,
          comment,
        });
        setLoading(false);
        setIssueSent(true);
      } catch (error) {
        dispatch(showToast(toastMessage));
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
  // add right header and description for each case
  if (issueSent) {
    return (
      <FeedbackView
        header={headerTitle}
        icon={<IconMotocycle />}
        background={colors.grey50}
        description={feedbackDescription}
      >
        <DefaultButton
          title={t('Voltar para o início')}
          onPress={() => navigation.navigate('Home')}
        />
      </FeedbackView>
    );
  }
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ ...screens.config }}
      keyboardShouldPersistTaps="always"
    >
      <PaddedView>
        <Text style={{ ...texts.xl, marginBottom: padding }}>{t('Qual foi seu problema?')}</Text>
        {issues.map((issue) => (
          <View style={{ marginBottom: padding }} key={issue.id}>
            <RadioButton
              title={issue.title}
              onPress={() => setSelectedIssue(issue)}
              checked={selectedIssue?.id === issue.id}
            />
          </View>
        ))}
        <Text
          style={{
            ...texts.xl,
            color: colors.grey700,
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
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
          blurOnSubmit
        />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <PaddedView style={{ backgroundColor: colors.white }}>
        <DefaultButton
          title={t('Enviar')}
          onPress={issueHandler}
          activityIndicator={isLoading}
          disabled={!selectedIssue || isLoading}
        />
      </PaddedView>
      {/* {issueType === 'courier-delivery-problem' && (
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
      )} */}
    </KeyboardAwareScrollView>
  );
};
