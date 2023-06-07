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
  vr?: boolean;
}

export const AcceptedCreditCards = ({ vr }: Props) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <VisaIcon />
      <View style={{ paddingLeft: halfPadding / 2 }}>
        <MasterCardIcon />
      </View>
      <View style={{ paddingLeft: halfPadding / 2 }}>
        <EloIcon />
      </View>
      <View style={{ paddingLeft: halfPadding / 2 }}>
        <DinersIcon />
      </View>
      {vr ? (
        <>
          <View style={{ paddingLeft: halfPadding / 2 }}>
            <VRAlimentacao />
          </View>
          <View style={{ paddingLeft: halfPadding / 2 }}>
            <VRRefeicao />
          </View>
        </>
      ) : null}
    </View>
  );
};
