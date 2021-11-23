import React from 'react';

export const useRefs = <T>() => {
  const first = React.useRef<T>(null);
  const second = React.useRef<T>(null);
  const third = React.useRef<T>(null);
  const fourth = React.useRef<T>(null);
  const fifth = React.useRef<T>(null);
  const sixth = React.useRef<T>(null);
  return [first, second, third, fourth, fifth, sixth];
};
