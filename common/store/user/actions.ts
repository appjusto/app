import {
  ConsumerProfile,
  CourierProfile,
  DeleteAccountPayload,
  Flavor,
  UserProfile,
  WithId,
} from '@appjusto/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from 'sentry-expo';
import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import { awaitWithFeedback } from '../ui/actions';

export const USER_AUTH_STATE_CHANGED = 'USER_AUTH_STATE_CHANGED';
export const CONSUMER_PROFILE_UPDATED = 'CONSUMER_PROFILE_UPDATED';
export const COURIER_PROFILE_UPDATED = 'COURIER_PROFILE_UPDATED';

export const observeAuthState = (api: Api) => (dispatch: AppDispatch) => {
  const unsubscribe = api.auth().observeAuthState((user) => {
    console.log(user);
    dispatch({ type: USER_AUTH_STATE_CHANGED, payload: user });
  });
  return unsubscribe;
};

export const signInWithEmail = (api: Api) => (email: string) => async (dispatch: AppDispatch) => {
  AsyncStorage.setItem('email', email);
  return dispatch(awaitWithFeedback(api.auth().sendSignInLinkToEmail(email)));
};

export const signInWithEmailAndPassword =
  (api: Api) => (email: string, password: string) => async (dispatch: AppDispatch) =>
    dispatch(awaitWithFeedback(api.auth().signInWithEmailAndPassword(email, password)));

export const getSignInEmail = () => {
  try {
    return AsyncStorage.getItem('email');
  } catch (error) {
    console.log(error);
    Sentry.Native.captureException(error);
    return Promise.resolve(null);
  }
};

export const isSignInWithEmailLink =
  (api: Api) =>
  (link: string | null): boolean => {
    return api.auth().isSignInWithEmailLink(link);
  };

export const signInWithEmailLink = (api: Api) => (email: string, link: string) => {
  return api.auth().signInWithEmailLink(email, link);
};

export const deleteAccount =
  (api: Api) => (payload: Partial<DeleteAccountPayload>) => async (dispatch: AppDispatch) => {
    await dispatch(awaitWithFeedback(api.deleteAccount(payload)));
    dispatch({ type: USER_AUTH_STATE_CHANGED, payload: null });
  };

// watch for updates
export const observeProfile =
  (api: Api) => (flavor: Flavor, id: string) => (dispatch: AppDispatch) => {
    return api.profile().observeProfile(id, (profile: WithId<UserProfile>): void => {
      const actionType = flavor === 'consumer' ? CONSUMER_PROFILE_UPDATED : COURIER_PROFILE_UPDATED;
      dispatch({ type: actionType, payload: { profile } });
    });
  };

export const updateProfile =
  (api: Api) =>
  (id: string, changes: Partial<CourierProfile> | Partial<ConsumerProfile>) =>
  async (dispatch: AppDispatch) => {
    return dispatch(awaitWithFeedback(api.profile().updateProfile(id, changes)));
  };
