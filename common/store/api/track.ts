import * as Segment from 'expo-analytics-segment';
import React from 'react';
import { getExtra } from '../../utils/config';

const { flavor } = getExtra();

interface Props {
  [key: string]: any;
}

export const track = (name: string, props: Props = {}) => {
  Segment.trackWithProperties(name, { ...props, flavor });
};

export const screen = (name: string, props: Props = {}) => {
  Segment.screenWithProperties(name, { ...props, flavor });
};

export const useTrack = (name: string, props?: Props) => {
  React.useEffect(() => {
    track(name, props);
  }, [name, props]);
};

export const useSegmentScreen = (name: string, props?: Props) => {
  React.useEffect(() => {
    screen(name, props);
  }, []);
};
