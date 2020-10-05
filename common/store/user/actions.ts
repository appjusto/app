import AsyncStorage from '@react-native-community/async-storage';
import { ConsumerProfile, CourierProfile, UserProfile, WithId } from 'appjusto-types';

import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { Flavor } from '../config/types';
import { awaitWithFeedback } from '../ui/actions';
import { DeleteAccountSurvey } from './types';

export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const CONSUMER_PROFILE_UPDATED = 'CONSUMER_PROFILE_UPDATED';
export const COURIER_PROFILE_UPDATED = 'COURIER_PROFILE_UPDATED';

export const observeAuthState = (api: Api) => (dispatch: AppDispatch) => {
  const unsubscribe = api.auth().observeAuthState((user) => {
    if (user) {
      dispatch({ type: USER_LOGGED_IN, payload: user });
    } else {
      dispatch({ type: USER_LOGGED_OUT });
    }
  });
  return unsubscribe;
};

export const signInWithEmail = (api: Api) => (email: string) => async (dispatch: AppDispatch) => {
  try {
    AsyncStorage.setItem('email', email);
  } catch (e) {
    console.error(e);
  }
  return dispatch(awaitWithFeedback(api.auth().sendSignInLinkToEmail(email)));
};

export const getSignInEmail = () => {
  try {
    return AsyncStorage.getItem('email');
  } catch (e) {
    console.error(e);
    return Promise.resolve(null);
  }
};

export const isSignInWithEmailLink = (api: Api) => (link: string | null): boolean => {
  return api.auth().isSignInWithEmailLink(link);
};

export const signInWithEmailLink = (api: Api) => (email: string, link: string) => {
  return api.auth().signInWithEmailLink(email, link);
};

export const signOut = (api: Api) => {
  return api.auth().signOut();
};

export const deleteAccount = (api: Api) => (survey: DeleteAccountSurvey) => {
  return api.auth().deleteAccount(survey);
};

// watch for updates
export const observeProfile = (api: Api) => (flavor: Flavor, id: string) => (
  dispatch: AppDispatch
) => {
  return api.profile().observeProfile(id, (profile: WithId<UserProfile>): void => {
    const actionType = flavor === 'consumer' ? CONSUMER_PROFILE_UPDATED : COURIER_PROFILE_UPDATED;
    dispatch({ type: actionType, payload: profile });
  });
};

export const updateProfile = (api: Api) => (
  id: string,
  changes: Partial<CourierProfile> | Partial<ConsumerProfile>
) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.profile().updateProfile(id, changes)));
};

export const updateLocation = (api: Api) => (
  id: string,
  location: firebase.firestore.GeoPoint
) => async (dispatch: AppDispatch) => {
  api.profile().updateLocation(id, location);
};
