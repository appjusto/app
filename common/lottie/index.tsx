import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';

interface Props {
  animationObject: AnimationObject;
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
export const Lottie = ({ animationObject }: Props) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef?.current?.play();
  }, []);

  return (
    <LottieView
      ref={animationRef}
      loop
      style={{
        width: 100,
        height: 100,
      }}
      source={animationObject}
    />
  );
};
