import React from 'react';
import { View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { halfPadding } from '../../../../common/styles';
import * as fake from '../fakeData';
import CuisinesBox from './CuisinesBox';
import DoubleHeader from './DoubleHeader';

type Props = {
  selected?: string;
};

export default function ({ selected }: Props) {
  return (
    <View>
      <DoubleHeader title="Tá com fome de que?" subtitle="Escolha por categoria" />
      <PaddedView style={{ flexDirection: 'row', marginTop: halfPadding }}>
        {/* TODO: replace with a flatlist */}
        <CuisinesBox cuisine="Pizza" image={fake.pizza} />
        <CuisinesBox cuisine="Oriental" image={fake.oriental} />
        <CuisinesBox cuisine="Mexicano" image={fake.mexican} />
      </PaddedView>
    </View>
  );
}
