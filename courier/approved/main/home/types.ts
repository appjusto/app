import { Fleet } from 'appjusto-types';

export type HomeParamList = {
  Home: undefined;
  PermissionDeniedFeedback: {
    title: string;
    subtitle: string;
  };
  FleetDetail: {
    fleet: Fleet;
  };
};
