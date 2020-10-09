import { OrderCourier } from 'appjusto-types/order';
import React, { useEffect, useState } from 'react';
import { View, Image, ImageURISource } from 'react-native';
import { useDispatch } from 'react-redux';

import * as icons from '../../../assets/icons';
import { AppDispatch } from '../../app/context';
import Api from '../../store/api/api';
import { getSelfieURL } from '../../store/courier/actions';
import { colors } from '../../styles';

type Props = {
  size?: number;
  api: Api;
  courier: OrderCourier | undefined;
};

export default function RoundedProfileImg({ size = 64, api, courier }: Props) {
  const [selfie, setSelfie] = useState<ImageURISource | undefined | null>();
  const dispatch = useDispatch<AppDispatch>();

  //get selfie
  useEffect(() => {
    if (selfie === undefined) {
      (async () => {
        console.log('checking for selfie');
        const selfieUri = await dispatch(getSelfieURL(api)(courier!.id!));
        console.log(selfieUri);
        setSelfie({ uri: selfieUri });
      })();
    }
  }, [selfie]);

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: colors.green,
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

// export const ProfileIcon = () => <RoundedIcon icon={icons.user} />;
