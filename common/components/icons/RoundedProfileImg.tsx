import { Flavor } from 'appjusto-types';
import React, { useContext, useEffect, useState } from 'react';
import { View, Image, ImageURISource } from 'react-native';
import { useDispatch } from 'react-redux';

import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../app/context';
import { getSelfieURL } from '../../store/courier/actions';
import { colors } from '../../styles';

type Props = {
  flavor?: Flavor;
  id?: string;
  size?: number;
};

export default function ({ flavor = 'courier', id, size = 64 }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // state
  const [selfie, setSelfie] = useState<ImageURISource>();

  // side effects
  // get selfie
  useEffect(() => {
    (async () => {
      console.log(flavor, id);
      if (flavor === 'courier' && !!id) {
        console.log('checking for selfie');
        const selfieUri = await dispatch(getSelfieURL(api)(id));
        if (selfieUri) setSelfie({ uri: selfieUri });
      }
    })();
  }, [flavor, id]);

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
