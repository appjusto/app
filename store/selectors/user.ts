import { State } from '..';
import { UserState } from '../types/user';

export const getUserState = (state: State): UserState => state.user;

export const getUser = (state: State): firebase.User | undefined => getUserState(state).user;
