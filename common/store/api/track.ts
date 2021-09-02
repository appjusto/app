import * as Segment from 'expo-analytics-segment';
import React from 'react';

interface Props {
  [key: string]: any;
}

export const track = (name: string, props?: Props) => {
  if (!props) Segment.track(name);
  else Segment.trackWithProperties(name, props);
};

export const screen = (name: string, props?: Props) => {
  if (!props) Segment.screen(name);
  else Segment.screenWithProperties(name, props);
};

export const useTrack = (name: string, props?: Props) => {
  React.useEffect(() => {
    track(name, props);
  }, [name, props]);
};

export const useSegmentScreen = (name: string, props?: Props) => {
  React.useEffect(() => {
    screen(name, props);
  }, [name, props]);
};
