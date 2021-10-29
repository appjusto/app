import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  animationObject: AnimationObject;
  styleProp: StyleProp<ViewStyle>;
  loopProp?: boolean;
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
export const Lottie = ({ animationObject, styleProp, loopProp = true }: Props) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef?.current?.play();
  }, []);

  return (
    <LottieView ref={animationRef} loop={loopProp} style={styleProp} source={animationObject} />
  );
};
