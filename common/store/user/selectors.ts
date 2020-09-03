import { State } from '..';
import { UserState } from './types';

export const getUserState = (state: State): UserState => state.user;

export const getUser = (state: State): firebase.User | undefined | null => getUserState(state).user;
