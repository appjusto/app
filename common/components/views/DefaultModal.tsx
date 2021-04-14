import React from 'react';
import { Modal, ModalProps, Text, View } from 'react-native';
import { colors, padding, texts } from '../../styles';
import DefaultButton from '../buttons/DefaultButton';

export interface DefaultModalProps extends ModalProps {
  header: string;
  body: string;
  dismissButtonTitle: string;
  onDismiss: () => void;
}

export const DefaultModal = ({
  header,
  body,
  dismissButtonTitle,
  onDismiss,
  ...props
}: DefaultModalProps) => {
  // UI
  return (
    <Modal transparent {...props}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            marginHorizontal: padding * 2,
            backgroundColor: colors.white,
            padding: padding * 2,
          }}
        >
          <Text style={{ ...texts.xl }}>{header}</Text>
          <Text style={{ ...texts.md, marginVertical: padding * 2 }}>{body}</Text>
          <DefaultButton title={dismissButtonTitle} onPress={onDismiss} />
        </View>
      </View>
    </Modal>
  );
};
