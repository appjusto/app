import { Fare } from '@appjusto/types';
import React from 'react';
import { Modal, Text, View } from 'react-native';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import HR from '../../../../common/components/views/HR';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { formatCurrency } from '../../../../common/utils/formatters';
import IzaIcon from './iza';

type Props = {
  fare?: Fare;
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export const OrderCostModal = ({ fare, visible, setModalVisible }: Props) => {
  if (!fare) return null;
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <PaddedView style={{ backgroundColor: colors.white, ...borders.default }}>
          <View style={{ padding: halfPadding }}>
            <Text style={{ ...texts.md, ...texts.bold }}>Entenda os custos</Text>
            <Text style={{ marginTop: halfPadding, ...texts.xs, color: colors.grey700 }}>
              O AppJusto não fica com nada desses valores
            </Text>
            <HR height={2} style={{ marginTop: halfPadding }} />
            {fare?.courier?.processing?.value ? (
              <View>
                <View
                  style={{
                    marginTop: padding,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ ...texts.sm }}>Tarifa financeira</Text>
                  <Text style={{ ...texts.sm }}>
                    {formatCurrency(fare.courier.processing.value)}
                  </Text>
                </View>
                <Text style={{ marginTop: halfPadding, ...texts.xs, color: colors.grey700 }}>
                  {fare.courier.processing.fee.fixed
                    ? `${formatCurrency(fare.courier.processing.fee.fixed)} + `
                    : ''}
                  {fare.courier.processing.fee.percent}% do valor da entrega.
                  {'\n'}
                  Custo financeiro da transação que incluímos no valor da entrega pra que o
                  entregador receba o valor líquido definido na frota.
                </Text>
              </View>
            ) : null}
            {fare?.courier?.insurance ? (
              <View>
                <View
                  style={{
                    marginTop: padding,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ ...texts.sm }}>Seguro</Text>
                    <View style={{ marginLeft: halfPadding }}>
                      <IzaIcon />
                    </View>
                  </View>
                  <Text style={{ ...texts.sm }}>{formatCurrency(fare.courier.insurance)}</Text>
                </View>
                <Text style={{ marginTop: halfPadding, ...texts.xs, color: colors.grey700 }}>
                  Durante esta corrida o entregador da rede AppJusto estará coberto pelo seguro
                  contra acidentes Iza.
                </Text>
              </View>
            ) : null}
            {fare?.courier?.locationFee ? (
              <View>
                <View
                  style={{
                    marginTop: padding,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ ...texts.sm }}>Taxa de alta demanda</Text>
                  <Text style={{ ...texts.sm }}>{formatCurrency(fare.courier.locationFee)}</Text>
                </View>
                <Text style={{ marginTop: halfPadding, ...texts.xs, color: colors.grey700 }}>
                  Em momentos de alta demanda, as plataformas incluem valores extras para garantir
                  que o pedido seja coletado. Esse valor é baseado no valor de marcado do momento e
                  é repassado integralmente para o entregador.
                </Text>
              </View>
            ) : null}
            <DefaultButton
              style={{ marginTop: padding }}
              title="Fechar"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </PaddedView>
      </View>
    </Modal>
  );
};
