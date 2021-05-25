// import * as Segment from 'expo-analytics-segment';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';
import { AnalyticsConfig } from '../../config/types';
import { getExtra } from '../utils/config';

const { environment, flavor } = getExtra();

export function init(props: AnalyticsConfig) {
  Sentry.init({
    dsn: props.sentryDNS,
    enableInExpoDevelopment: true,
    debug: environment !== 'live',
    environment,
    release: Constants.manifest.revisionId,
  });

  const {
    segmentConsumerAndroidKey,
    segmentConsumeriOSKey,
    segmentCourierAndroidKey,
    segmentCourieriOSKey,
  } = props;
  if (
    !segmentConsumerAndroidKey ||
    !segmentConsumeriOSKey ||
    !segmentCourierAndroidKey ||
    !segmentCourieriOSKey
  )
    return;
  console.log('Segment.initialize');
  // Segment.initialize(
  //   flavor === 'consumer'
  //     ? {
  //         androidWriteKey: segmentConsumerAndroidKey,
  //         iosWriteKey: segmentConsumeriOSKey,
  //       }
  //     : {
  //         androidWriteKey: segmentCourierAndroidKey,
  //         iosWriteKey: segmentCourieriOSKey,
  //       }
  // );
}
