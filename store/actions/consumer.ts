import AsyncStorage from '@react-native-community/async-storage';
import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api';

export const observeSignIn = (api: Api) => (flavor: string) => (dispatch: Dispatch<any>) => {
  const unsubscribe = api.observeSignIn((user) => {
    if (user) dispatch({ type: actionTypes.USER_LOGGED_IN, payload: { user, flavor } });
    else dispatch({ type: actionTypes.USER_LOGGED_OUT });
  });
  return unsubscribe;
};

export const signInWithEmail = (api: Api) => (email: string) => {
  try {
    AsyncStorage.setItem('email', email);
  } catch (e) {
    console.error(e);
  }
  return api.sendSignInLinkToEmail(email);
};

export const getSignInEmail = () => {
  try {
    return AsyncStorage.getItem('email');
  } catch (e) {
    console.error(e);
    return Promise.resolve(null);
  }
};

export const isSignInWithEmailLink = (api: Api) => (link: string): boolean => {
  return api.isSignInWithEmailLink(link);
};

export const signInWithEmailLink = (api: Api) => (email: string, link: string) => {
  return api.signInWithEmailLink(email, link);
};
