import { Order } from '@appjusto/types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import RadioButton from '../../../../../common/components/buttons/RadioButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../../common/components/inputs/DefaultInput';
import RoundedText from '../../../../../common/components/texts/RoundedText';
import HR from '../../../../../common/components/views/HR';
import { ModalToast } from '../../../../../common/components/views/ModalToast';
import { borders, colors, halfPadding, padding, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';

type Props = {
  modalVisible: boolean;
  onModalClose: () => void;
  order: Order;
  onEditAddress: () => void;
  onConfirmAddress: () => void;
  activityIndicator: boolean;
  complement: string;
  onChangeComplement: (complement: string) => void;
  checked: boolean;
  toggleAddressComplement: () => void;
  disabled: boolean;
};

export const DestinationModal = ({
  modalVisible,
  onModalClose,
  order,
  onEditAddress,
  onConfirmAddress,
  activityIndicator,
  complement,
  onChangeComplement,
  checked,
  toggleAddressComplement,
  disabled,
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
          <Text style={{ ...texts.lg, marginTop: 4, color: colors.grey700 }}>
            {order?.destination?.address.main}
          </Text>
          <Text style={{ ...texts.lg, marginTop: 4, color: colors.grey700 }}>
            {order?.destination?.address.secondary}
          </Text>
          <View style={{ marginTop: halfPadding }}>
            <TouchableOpacity onPress={onEditAddress}>
              <RoundedText backgroundColor={colors.yellow} noBorder>
                {t('Editar endereço')}
              </RoundedText>
            </TouchableOpacity>
            <DefaultInput
              defaultValue={complement}
              value={complement}
              title={t('Complemento')}
              placeholder={t('Apartamento, sala, loja')}
              onChangeText={onChangeComplement}
              style={{ marginVertical: padding }}
              autoCorrect={false}
              editable={!checked}
            />
            <View>
              <RadioButton
                title={t('Endereço sem complemento')}
                onPress={toggleAddressComplement}
                checked={checked}
                variant="square"
              />
            </View>
          </View>
          <HR style={{ marginTop: 24 }} />
          <DefaultButton
            style={{ marginTop: halfPadding, marginBottom: padding }}
            title={t('Fazer pedido')}
            onPress={onConfirmAddress}
            disabled={disabled}
            activityIndicator={activityIndicator}
          />
        </PaddedView>
        <ModalToast />
      </View>
    </Modal>
  );
};
