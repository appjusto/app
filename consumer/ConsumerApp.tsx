import React from 'react';

import AuthContainer from '../common/app/AuthContainer';
import UnloggedNavigator from '../common/screens/unlogged/UnloggedNavigator';
import LoggedNavigator from './LoggedNavigator';

export default function () {
  return <AuthContainer Logged={LoggedNavigator} Unlogged={UnloggedNavigator} />;
}
