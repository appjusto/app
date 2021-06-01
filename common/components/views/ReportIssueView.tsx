import React from 'react';
import { Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { t } from '../../../strings';
import { halfPadding, padding, screens, texts } from '../../styles';
import DefaultButton from '../buttons/DefaultButton';
import PaddedView from '../containers/PaddedView';
import DefaultInput from '../inputs/DefaultInput';

type Props = {
  title: string;
  inputHeader: string;
  comment: string;
  setComment: (text: string) => void;
  disabled: boolean;
  onSendIssue: () => void;
  isLoading: boolean;
  children: React.ReactNode;
};

export const ReportIssueView = ({
  title,
  inputHeader,
  comment,
  setComment,
  disabled,
  onSendIssue,
  isLoading,
  children,
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
        {children}
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
      <PaddedView>
        <DefaultButton
          title={t('Enviar')}
          onPress={onSendIssue}
          activityIndicator={isLoading}
          disabled={disabled}
        />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
