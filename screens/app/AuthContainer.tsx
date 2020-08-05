import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import useAuth, { AuthState } from '../../hooks/useAuth';
import { showToast } from '../../store/ui/actions';
import { t } from '../../strings';

interface Props {
  Unlogged: React.FunctionComponent;
  Logged: React.FunctionComponent;
}

export default ({ Unlogged, Logged }: Props) => {
  // context
  const dispatch = useDispatch();

  // side effects
  const [authState, user] = useAuth();
  useEffect(() => {
    if (authState === AuthState.InvalidCredentials) {
      dispatch(showToast(t('Sua sessão expirou. Faça login novamente.')));
    }
  }, [authState, user]);

  // UI
  // show nothing while checking for credentials
  if (
    authState === AuthState.CheckingPreviousSession ||
    authState === AuthState.CheckingDeeplink ||
    authState === AuthState.SigningIn
  )
    return null;

  // unlogged stack
  if (authState !== AuthState.SignedIn) {
    return <Unlogged />;
  }

  // logged stack
  return <Logged />;
};
