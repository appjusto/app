import React from 'react';
import { View } from 'react-native';
import { halfPadding } from '../../../common/styles';
import { VRAlimentacao } from './vr-alimentacao';
import { VRRefeicao } from './vr-refeicao';

export const AcceptedVRCards = () => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <VRRefeicao />
      <View style={{ paddingLeft: halfPadding / 2 }}>
        <VRAlimentacao />
      </View>
    </View>
  );
};
