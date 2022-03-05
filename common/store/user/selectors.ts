import { User } from 'firebase/auth';
import { State } from '..';
import { UserState } from './types';

export const getUserState = (state: State): UserState => state.user;

export const getUser = (state: State): User | undefined | null => getUserState(state).user;
