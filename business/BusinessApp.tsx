import React from 'react';
import AuthContainer from '../common/app/AuthContainer';
import { LoggedNavigator } from '../consumer/v2/LoggedNavigator';
import { UnloggedBusinessNavigator } from './UnloggedBusinessNavigator';

export const BusinessApp = () => {
  // TODO: create and add LoggedBusinessNavigator
  return <AuthContainer Logged={LoggedNavigator} Unlogged={UnloggedBusinessNavigator} />;
};
