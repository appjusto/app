import * as Segment from 'expo-analytics-segment';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import { AnalyticsConfig } from '../../config/types';
import { getExtra } from '../utils/config';

const { environment, flavor } = getExtra();

export function init(props: AnalyticsConfig) {
  Segment.initialize(
    flavor === 'consumer'
      ? {
          androidWriteKey: props.segmentConsumerAndroidKey,
          iosWriteKey: props.segmentConsumeriOSKey,
        }
      : {
          androidWriteKey: props.segmentCourierAndroidKey,
          iosWriteKey: props.segmentCourieriOSKey,
        }
  );
  Sentry.init({
    dsn: props.sentryDNS,
    enableInExpoDevelopment: true,
    debug: environment !== 'live',
    environment,
    release: Constants.manifest.revisionId,
  });
}
