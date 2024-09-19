import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { ProductService } from '../../product.service';
import * as ProductActions from '../actions/product.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

export const loadProductsEffect = createEffect(() => {
  const productService = inject(ProductService);

  return inject(Actions).pipe(
    ofType(ProductActions.loadProducts),
    mergeMap(() =>
      productService.getProducts().pipe(
        map((products) => ProductActions.loadProductsSuccess({ products })),
        catchError((error) =>
          of(ProductActions.loadProductsFailure({ error }))
        )
      )
    )
  );
}, { functional: true });