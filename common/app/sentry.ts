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
  });
  Sentry.Native.setExtra('flavor', flavor);
}
