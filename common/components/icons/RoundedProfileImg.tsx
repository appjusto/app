import { Flavor } from '@appjusto/types';
import React, { useEffect, useState } from 'react';
import { Image, ImageURISource, View } from 'react-native';
import { IconChat } from '../../icons/icon-chat';
import { useBusinessLogoURI } from '../../store/api/business/hooks/useBusinessLogoURI';
import useCourierSelfie from '../../store/api/courier/hooks/useCourierSelfie';
import { colors } from '../../styles';

type Props = {
  flavor?: Flavor;
  id?: string;
  size?: number;
};

export default function ({ flavor = 'courier', id, size = 40 }: Props) {
  // state
  const [selfie, setSelfie] = useState<ImageURISource>();
  const currentSelfieQuery = useCourierSelfie(id, '160x160');
  const [logo, setLogo] = useState<ImageURISource>();
  const currentLogoQuery = useBusinessLogoURI(id);

  // side effects
  // get selfie
  useEffect(() => {
    if (currentSelfieQuery.data) {
      setSelfie({ uri: currentSelfieQuery.data });
    }
  }, [currentSelfieQuery.data]);
  // get logo
  useEffect(() => {
    if (flavor === 'business') {
      if (currentLogoQuery.data) {
        setLogo({ uri: currentLogoQuery.data });
      }
    }
  }, [currentLogoQuery.data, flavor]);

  // UI
  const roundedImageUI = () => {
    if (flavor === 'consumer') return <IconChat />;
    else if (flavor === 'business') {
      if (logo) {
        return (
          <Image source={logo} style={{ height: size, width: size, borderRadius: size / 2 }} />
        );
      } else return <IconChat />;
    } else if (flavor === 'courier') {
      if (selfie) {
        return (
          <Image source={selfie} style={{ height: size, width: size, borderRadius: size / 2 }} />
        );
      } else return <IconChat />;
    }
  };
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green500,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.black,
        borderRadius: size / 2,
      }}
    >
      {roundedImageUI()}
    </View>
  );
}
