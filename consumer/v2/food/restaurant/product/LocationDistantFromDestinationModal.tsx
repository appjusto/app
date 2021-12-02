import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { borders, colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

type Props = {
  modalVisible: boolean;
  onModalClose: () => void;
  positiveAnswer: () => void;
  negativeAnswer: () => void;
};

export const LocationDistantFromDestinationModal = ({
  modalVisible,
  onModalClose,
  positiveAnswer,
  negativeAnswer,
}: Props) => {
  return (
    <Modal transparent animationType="slide" visible={modalVisible}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <PaddedView style={{ backgroundColor: colors.white, ...borders.default }}>
          <View style={{ alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={onModalClose}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialIcons name="close" size={12} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ ...texts.xl, textAlign: 'center', marginTop: halfPadding }}>
            {t('Seu endereço de entrega não bate com a sua localização.')}
          </Text>
          <Text style={{ ...texts.md, textAlign: 'center', marginTop: padding }}>
            {t('Você quer continuar mesmo assim?')}
          </Text>
          <DefaultButton style={{ marginTop: padding }} title={t('Sim')} onPress={positiveAnswer} />
          <DefaultButton
            style={{ marginTop: halfPadding, backgroundColor: colors.white }}
            title={t('Não, quero cancelar')}
            onPress={negativeAnswer}
          />
        </PaddedView>
      </View>
    </Modal>
  );
};
