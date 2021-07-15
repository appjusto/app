import React from 'react';
import AuthContainer from '../common/app/AuthContainer';
import LoggedNavigator from './LoggedNavigator';
import UnloggedNavigator from './UnloggedNavigator';

export default function () {
  return <AuthContainer Logged={LoggedNavigator} Unlogged={UnloggedNavigator} />;
}
