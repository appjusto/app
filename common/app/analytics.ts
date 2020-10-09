import * as Segment from 'expo-analytics-segment';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

type Props = {
  segmentAndroidKey: string;
  segmentiOSKey: string;
  sentryDNS: string;
};

export function init(props: Props) {
  Segment.initialize({
    androidWriteKey: props.segmentAndroidKey,
    iosWriteKey: props.segmentiOSKey,
  });
  Sentry.init({
    dsn: props.sentryDNS,
    enableInExpoDevelopment: true,
    debug: true,
  });
  if (Constants.manifest.revisionId) {
    Sentry.Native.setRelease(Constants.manifest.revisionId!);
  }
}
