import React from 'react';
import AuthContainer from '../common/app/AuthContainer';
import { LoggedNavigator } from '../consumer/v2/LoggedNavigator';
import UnloggedNavigator from '../consumer/v2/UnloggedNavigator';

export const BusinessApp = () => {
  return <AuthContainer Logged={LoggedNavigator} Unlogged={UnloggedNavigator} />;
};
