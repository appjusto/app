import { createClient } from '@segment/analytics-react-native';
import React from 'react';
import { getExtra } from '../../utils/config';

const { flavor, analytics } = getExtra();

export const segmentClient = createClient({
  writeKey:
    flavor === 'consumer'
      ? analytics.segmentConsumerAndroidKey
      : analytics.segmentCourierAndroidKey,
});

interface Props {
  [key: string]: any;
}

export const track = (name: string, props: Props = {}) => {
  segmentClient.track(name, { ...props, flavor });
};

export const screen = (name: string, props: Props = {}) => {
  segmentClient.screen(name, { ...props, flavor });
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
