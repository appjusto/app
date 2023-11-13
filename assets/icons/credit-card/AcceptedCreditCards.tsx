import { PayableWith } from '@appjusto/types';
import { BraspagPayableWith } from '@appjusto/types/payment';
import React from 'react';
import { View } from 'react-native';
import { halfPadding } from '../../../common/styles';
import { DinersIcon } from './diners-icon';
import { EloIcon } from './elo-icon';
import { MasterCardIcon } from './mastercard-icon';
import { VisaIcon } from './visa-icon';
import { VRAlimentacao } from './vr-alimentacao';
import { VRRefeicao } from './vr-refeicao';

interface Props {
  types?: (PayableWith | BraspagPayableWith)[];
}

export const AcceptedCreditCards = ({ types }: Props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {types?.includes('credit_card') ? (
        <>
          <View style={{ marginRight: halfPadding / 2 }}>
            <VisaIcon />
          </View>
          <View style={{ marginRight: halfPadding / 2 }}>
            <MasterCardIcon />
          </View>
          <View style={{ marginRight: halfPadding / 2 }}>
            <EloIcon />
          </View>
          <View style={{ marginRight: halfPadding / 2 }}>
            <DinersIcon />
          </View>
        </>
      ) : null}
      {types?.includes('vr-alimentação') ? (
        <View style={{ marginRight: halfPadding / 2 }}>
          <VRAlimentacao />
        </View>
      ) : null}
      {types?.includes('vr-refeição') ? (
        <View style={{ marginRight: halfPadding / 2 }}>
          <VRRefeicao />
        </View>
      ) : null}
    </View>
  );
};
