import React from 'react';
import { View } from 'react-native';
import { halfPadding } from '../../../common/styles';
import { DinersIcon } from './diners-icon';
import { EloIcon } from './elo-icon';
import { MasterCardIcon } from './mastercard-icon';
import { VisaIcon } from './visa-icon';

export const AcceptedCreditCards = () => {
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
    </View>
  );
};
