import React from 'react';
import AuthContainer from '../common/app/AuthContainer';
import { LoggedBusinessNavigator } from './LoggedBusinessNavigator';
import { UnloggedBusinessNavigator } from './UnloggedBusinessNavigator';

export const BusinessApp = () => {
  return <AuthContainer Logged={LoggedBusinessNavigator} Unlogged={UnloggedBusinessNavigator} />;
};
