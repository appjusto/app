import AsyncStorage from '@react-native-community/async-storage';
import { Dispatch } from 'redux';

import * as actionTypes from '../actionTypes';
import Api from '../api/api';

export const observeAuthState = (api: Api) => (dispatch: Dispatch<any>) => {
  const unsubscribe = api.auth().observeAuthState((user) => {
    if (user) {
      dispatch({ type: actionTypes.USER_LOGGED_IN, payload: user });
    } else {
      dispatch({ type: actionTypes.USER_LOGGED_OUT });
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
