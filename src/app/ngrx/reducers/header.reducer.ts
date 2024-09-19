import { createReducer, on } from '@ngrx/store';
import * as HeaderActions from '../actions/header.actions';

export interface HeaderState {
  title: string;
}

export const initialState: HeaderState = {
  title: 'Default Title', // Default title
};

export const headerReducer = createReducer(
  initialState,
  on(HeaderActions.updateHeaderTitle, (state, { title }) => ({
    ...state,
    title,
  }))
);
