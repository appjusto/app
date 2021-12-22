import { Order } from '@appjusto/types';
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
  order: Order;
  onEditAddress: () => void;
  onConfirmAddress: () => void;
  activityIndicator: boolean;
};

export const DestinationModal = ({
  modalVisible,
  onModalClose,
  order,
  onEditAddress,
  onConfirmAddress,
  activityIndicator,
}: Props) => {
  return (
    <Modal transparent visible={modalVisible} animationType="slide">
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
          <Text style={{ ...texts.lg, marginTop: 4 }}>{order?.destination?.address.main}</Text>
          <Text style={{ ...texts.lg, marginTop: 4 }}>{order?.destination?.address.secondary}</Text>
          {order?.destination?.additionalInfo ? (
            <Text style={{ ...texts.lg, marginTop: 4 }}>{order.destination.additionalInfo}</Text>
          ) : null}
          <View style={{ marginTop: 24 }}>
            <TouchableOpacity onPress={onEditAddress}>
              <RoundedText>{t('Editar endereço de entrega')}</RoundedText>
            </TouchableOpacity>
          </View>
          <HR style={{ marginTop: 24 }} />
          <DefaultButton
            style={{ marginTop: halfPadding, marginBottom: padding }}
            title={t('Fazer pedido')}
            onPress={onConfirmAddress}
            disabled={activityIndicator}
            activityIndicator={activityIndicator}
            disabled={activityIndicator}
          />
        </PaddedView>
      </View>
    </Modal>
  );
};
