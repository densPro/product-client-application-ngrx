import { createReducer, on } from '@ngrx/store';
import { Product } from '../../product.model';
import * as ProductActions from '../actions/product.actions';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: any;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
