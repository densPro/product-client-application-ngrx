import { createAction, props } from '@ngrx/store';

export const updateHeaderTitle = createAction(
  '[Header] Update Title',
  props<{ title: string }>()
);