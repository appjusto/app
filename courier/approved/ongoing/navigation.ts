import { LatLng } from 'appjusto-types';

export type NavigationApp = 'google-maps' | 'waze';

export const getGoogleMapsNavigationLinkTo = (location: LatLng | undefined) =>
  location
    ? `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&dir_action=navigate`
    : 'https://www.google.com/maps/search/?api=1';

export const getWazeNavigationLinkTo = (location: LatLng | undefined) =>
  location
    ? `https://www.waze.com/ul?ll=${location.latitude}%2C${location.longitude}&navigate=yes&zoom=17`
    : 'https://waze.com/ul';

export const getNavigationLinkTo = (app: NavigationApp, location: LatLng | undefined) => {
  if (app === 'google-maps') return getGoogleMapsNavigationLinkTo(location);
  else if (app === 'waze') return getWazeNavigationLinkTo(location);
  return '';
};
