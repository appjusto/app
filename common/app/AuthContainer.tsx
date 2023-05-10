import React from 'react';
import { useSelector } from 'react-redux';
import { getUser } from '../store/user/selectors';

interface Props {
  Unlogged: React.FunctionComponent;
  Logged: React.FunctionComponent;
}

export default ({ Unlogged, Logged }: Props) => {
  // redux state
  const user = useSelector(getUser);

  // UI
  // checking
  if (user === undefined) return null;

  // unlogged stack
  if (user === null) {
    return <Unlogged />;
  }

  // logged stack
  return <Logged />;
};
