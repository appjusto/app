import React from 'react';

import AuthContainer from '../app/AuthContainer';
import UnloggedNavigator from '../unlogged/UnloggedNavigator';
import LoggedNavigator from './LoggedNavigator';

export default function () {
  return <AuthContainer Logged={LoggedNavigator} Unlogged={UnloggedNavigator} />;
}
