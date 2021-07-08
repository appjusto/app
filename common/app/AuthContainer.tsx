import React from 'react';
import { useDispatch } from 'react-redux';
import { t } from '../../strings';
import { AuthState, useAuth } from '../hooks/useAuth';
import { showToast } from '../store/ui/actions';

interface Props {
  Unlogged: React.FunctionComponent;
  Logged: React.FunctionComponent;
}

export default ({ Unlogged, Logged }: Props) => {
  // context
  const dispatch = useDispatch();

  // side effects
  const [authState] = useAuth();
  React.useEffect(() => {
    if (authState === AuthState.InvalidCredentials) {
      dispatch(showToast(t('Sua sessão expirou. Faça login novamente.'), 'error'));
    }
  }, [authState, dispatch]);

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
