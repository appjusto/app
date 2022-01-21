import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  animationObject: AnimationObject;
  iconStyle: StyleProp<ViewStyle>;
  shouldLoop?: boolean;
}

interface AnimationObject {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: any[];
}

// TODO: Pass properties.
export const Lottie = ({ animationObject, iconStyle, shouldLoop = true }: Props) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef?.current?.play();
  }, []);

  return (
    <LottieView ref={animationRef} loop={shouldLoop} style={iconStyle} source={animationObject} />
  );
};
