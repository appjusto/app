import AsyncStorage from '@react-native-community/async-storage';
import { Dispatch } from 'redux';

import Api from '../api';

export const signInWithEmail = (api: Api) => (email: string) => async (dispatch: Dispatch<any>) => {
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

export const signInWithEmailLink = (api: Api) => (email: string, link: string) => async (
  dispatch: Dispatch<any>
) => {
  return api.signInWithEmailLink(email, link);
};
