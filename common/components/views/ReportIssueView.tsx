import { Issue, WithId } from '@appjusto/types';
import React from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { t } from '../../../strings';
import { halfPadding, padding, screens, texts } from '../../styles';
import DefaultButton from '../buttons/DefaultButton';
import RadioButton from '../buttons/RadioButton';
import PaddedView from '../containers/PaddedView';
import DefaultInput from '../inputs/DefaultInput';

type Props = {
  title: string;
  issues: WithId<Issue>[];
  inputHeader: string;
  comment: string;
  setComment: (text: string) => void;
  disabled: boolean;
  onSendIssue: () => void;
  isLoading: boolean;
  selectIssue: (issue: WithId<Issue>) => void;
  checked: boolean;
};

export const ReportIssueView = ({
  title,
  issues,
  inputHeader,
  comment,
  setComment,
  disabled,
  onSendIssue,
  isLoading,
  selectIssue,
  checked,
}: Props) => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <PaddedView>
        <Text style={{ ...texts.xl, marginBottom: padding }}>{title}</Text>
        {issues.map((issue) => (
          <View style={{ marginBottom: padding }} key={issue.id}>
            <RadioButton
              title={issue.title}
              onPress={() => selectIssue(issue)}
              // checked={selectedIssue?.id === issue.id}
              checked={checked}
            />
          </View>
        ))}
        <Text
          style={{
            ...texts.sm,
            marginTop: 24,
            marginBottom: halfPadding,
          }}
        >
          {inputHeader}
        </Text>
        <DefaultInput
          style={{ height: 128 }}
          placeholder={t('Escreva sua mensagem')}
          multiline
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
          blurOnSubmit
        />
      </PaddedView>
      <View style={{ flex: 1 }} />
      <PaddedView>
        <DefaultButton
          title={t('Enviar')}
          onPress={onSendIssue}
          activityIndicator={isLoading}
          // disabled={!selectedIssue || isLoading}
          disabled={disabled}
        />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
