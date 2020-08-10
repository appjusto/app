import AsyncStorage from '@react-native-community/async-storage';

import { AppDispatch } from '../../screens/app/context';
import Api from '../api/api';
import { Flavor } from '../config/types';
import { UserProfile } from './types';

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

export const signInWithEmail = (api: Api) => (email: string) => {
  try {
    AsyncStorage.setItem('email', email);
  } catch (e) {
    console.error(e);
  }
  return api.auth().sendSignInLinkToEmail(email);
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

// watch for updates
export const observeProfile = (api: Api) => (flavor: Flavor, id: string) => (
  dispatch: AppDispatch
) => {
  const actionType = flavor === 'consumer' ? CONSUMER_PROFILE_UPDATED : COURIER_PROFILE_UPDATED;

  const unsubscribeProfileUpdate = api
    .profile()
    .observeProfile(id, (courier: UserProfile): void => {
      dispatch({ type: actionType, payload: courier });
    });
  // watch private info changes
  const unsubscribePrivateInfoUpdate = api
    .profile()
    .observePrivateInfo(id, (courier: UserProfile): void => {
      dispatch({ type: actionType, payload: courier });
    });

  return (): void => {
    unsubscribeProfileUpdate();
    unsubscribePrivateInfoUpdate();
  };
};

export const updateProfile = (api: Api) => (id: string, changes: object) => {
  return api.profile().updateProfile(id, changes);
};
