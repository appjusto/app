import { Flavor } from 'appjusto-types';
import React, { useEffect, useState } from 'react';
import { View, Image, ImageURISource } from 'react-native';

import * as icons from '../../../assets/icons';
import useCourierSelfie from '../../hooks/queries/useCourierSelfie';
import { colors } from '../../styles';

type Props = {
  flavor?: Flavor;
  id?: string;
  size?: number;
};

export default function ({ flavor = 'courier', id, size = 64 }: Props) {
  // state
  const [selfie, setSelfie] = useState<ImageURISource>();
  const currentSelfieQuery = useCourierSelfie(id);

  // side effects
  // get selfie
  useEffect(() => {
    if (currentSelfieQuery.data) {
      setSelfie({ uri: currentSelfieQuery.data });
    }
  }, [currentSelfieQuery.data]);

  // UI
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: size / 2,
      }}
    >
      <Image
        source={selfie ?? icons.user}
        style={{ height: size, width: size, borderRadius: size / 2 }}
      />
    </View>
  );
}
