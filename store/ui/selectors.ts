import { State } from '..';
import { UIState } from './types';

export const getUIState = (state: State): UIState => state.ui;

export const getToast = (state: State) => getUIState(state).toast;
export const getUIBlocked = (state: State) => getUIState(state).blockUI;
