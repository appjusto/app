import React from 'react';
import AuthContainer from '../common/app/AuthContainer';
import { LoggedNavigator } from './v2/LoggedNavigator';
import UnloggedNavigator from './v2/UnloggedNavigator';

export default function () {
  return <AuthContainer Logged={LoggedNavigator} Unlogged={UnloggedNavigator} />;
}
