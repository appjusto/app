import { State } from '..';
import { UIState } from '../types/ui';

export const getUIState = (state: State): UIState => state.ui;

export const getToastMessage = (state: State) => getUIState(state).toast.message;

export const getToastType = (state: State) => getUIState(state).toast.type;
