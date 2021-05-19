import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import HR from '../../../../../common/components/views/HR';
import { borders, colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

type Props = {
  modalVisible: boolean;
  onModalClose: () => void;
};

export const DestinationModal = ({ modalVisible, onModalClose }: Props) => {
  return (
    <Modal transparent visible={modalVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
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
                <MaterialIcons name="close" size={16} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ ...texts.xl }}>{t('Confirme seu endereço')}</Text>
          <Text style={{ ...texts.sm, marginTop: padding, color: colors.grey700 }}>
            {t('Seu pedido será entregue em:')}
          </Text>
          <Text style={{ ...texts.lg, marginTop: 4 }}>
            {t('Rua dos Pinheiros, 100 - São Paulo/SP')}
          </Text>
          <Text style={{ ...texts.lg, marginBottom: 24 }}>{t('Apto 14')}</Text>
          <RoundedText>{t('Editar endereço de entrega')}</RoundedText>
          <HR style={{ marginTop: 24 }} />
          <DefaultButton
            style={{ marginTop: halfPadding, marginBottom: padding }}
            title={t('Confirmar endereço de entrega')}
            onPress={onModalClose}
          />
        </PaddedView>
      </View>
    </Modal>
  );
};
