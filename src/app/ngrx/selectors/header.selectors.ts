import { createSelector, createFeatureSelector } from '@ngrx/store';
import { HeaderState } from '../reducers/header.reducer';

export const selectHeaderState = createFeatureSelector<HeaderState>('header');

export const selectHeaderTitle = createSelector(
 selectHeaderState,
 (state: HeaderState) => state.title
);