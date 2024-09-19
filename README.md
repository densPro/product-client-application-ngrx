# Steps to Follow in the Demo

## Header Title Example

### 1. Install Required NgRx Libraries

To start, install the necessary NgRx libraries for state management and side effects handling. Run the following commands:

```bash
npx ng add @ngrx/store@latest
npx ng add @ngrx/effects@latest
npx ng add @ngrx/store-devtools@latest
```

These libraries include:

- **`@ngrx/store`**: Manages the state of your application.
- **`@ngrx/effects`**: Manages side effects, such as HTTP requests.
- **`@ngrx/store-devtools`**: Helps in debugging state changes with the Redux DevTools.

### 2. Create a Header Action

In NgRx, **actions** express unique events that occur throughout your application. Before diving into creating actions, consider the following principles:

- **Upfront**: Define actions before developing features. This helps in planning and gaining a clear understanding of the feature being implemented.
- **Categorize**: Organize actions based on the event source (e.g., UI events, network events).
- **Use Many**: Actions are lightweight. The more actions you define, the clearer the flow of events in your application will be.
- **Event-Driven**: Capture events, not commands. This separates the description of an event from how it is handled.
- **Descriptive**: Provide meaningful names and context for each action to aid debugging and readability.

#### Example: Creating the Header Action

Create a new file called `header.actions.ts` inside the `ngrx/actions/` directory of your project. Add the following code to define an action that updates the header title:

```typescript
import { createAction, props } from "@ngrx/store";

export const updateHeaderTitle = createAction("[Header] Update Title", props<{ title: string }>());
```

- **`createAction`**: This function creates a new action. It takes two arguments:

  1. **Type**: A string that describes the event. In this case, `'[Header] Update Title'` specifies that the action updates the title in the header component.
  2. **Payload**: (Optional) Data that the action carries. Here, `props<{ title: string }>()` defines the payload structure, where `title` is a string.

- **Payload Explanation**: The `props` function helps define the shape of the data the action carries. This payload will be used when dispatching the action to update the header title.

Now you have an action that can be dispatched to update the header title in your state management.

### 3. Create a Header Reducer

A **reducer** is a pure function that handles state changes in response to dispatched actions. It takes the current state and an action, and returns a new state based on the action. Reducers should always return a new state object rather than mutating the existing one.

Create the following reducer in `ngrx/reducers/header.reducer.ts`:

```typescript
import { createReducer, on } from "@ngrx/store";
import * as HeaderActions from "../actions/header.actions";

export interface HeaderState {
  title: string;
}

export const initialState: HeaderState = {
  title: "Default Title", // Default title
};

export const headerReducer = createReducer(
  initialState,
  on(HeaderActions.updateHeaderTitle, (state, { title }) => ({
    ...state,
    title,
  }))
);
```

- This reducer listens for the `updateHeaderTitle` action and updates the `title` field in the state when that action is dispatched.
- The `on` function maps the action to the logic that handles how the state should change.

### 4. Create a Header Selector

A **selector** is a function used to extract specific pieces of information from the state. It helps in optimizing state access by allowing only required parts of the state to be selected.

Create the following selector in `ngrx/selectors/header.selectors.ts`:

```typescript
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { HeaderState } from "../reducers/header.reducer";

export const selectHeaderState = createFeatureSelector<HeaderState>("header");

export const selectHeaderTitle = createSelector(selectHeaderState, (state: HeaderState) => state.title);
```

- The `selectHeaderState` selector retrieves the entire header state.
- The `selectHeaderTitle` selector extracts the `title` from the header state.
- Selectors are useful for efficiently accessing and computing derived data from the store.

### 5. Add header reducer in app.config

Now, integrate the headerReducer into your application's global store. Update the app.config.ts file as follows:

```
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { headerReducer } from './ngrx/reducers/header.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      header: headerReducer,
    }),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};

```

This integrates the reducer into the global state, allowing you to manage the header title via the store.

### 6. Modify AppComponent to Use Header Title Selector

Update app.component.ts to use the NgRx selector to retrieve the header title from the store:

```
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { select } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { selectHeaderTitle } from './ngrx/selectors/header.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title$!: Observable<string>;
  constructor(private store: Store) { }
  ngOnInit(): void {
    this.title$ = this.store.pipe(select(selectHeaderTitle));
  }
}

```

The title$ observable holds the header title, which is selected from the store using selectHeaderTitle.

### 7. Update AppComponent HTML to Bind Header Title

Now, modify the app.component.html to display the header title:

```
<div>
  <h2 class="page-title">{{ title$ | async }}</h2>
  <router-outlet />
</div>

```

This binds the title$ observable to the h2 element, dynamically updating the title as the store changes.

### 8. Dispatch Header Title Update from Product List Component

Next, modify the ProductListComponent to dispatch an action that updates the header title when the component is initialized:

```
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product } from '../product.model';
import * as fromActions from '../ngrx/actions/header.actions';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products$: Observable<Product[]> | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    private store: Store
  ) {
    // Update header title
    this.store.dispatch(fromActions.updateHeaderTitle({ title: 'Products' }));
  }

  ngOnInit() {
    this.products$ = this.productService
      .getProducts()
      .pipe(map((products) => products.slice().sort((a, b) => b.id - a.id)));
  }

  editProduct(id: number) {
    this.router.navigateByUrl(`/products/${id}`);
  }

  addProduct() {
    this.router.navigateByUrl(`/add-product`);
  }
}
```

The action is dispatched in the constructor to update the header title to "Products" when the component is initialized.

### 9. Change product details to changes the header title state with dispatch and read it with a selector.

```
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product } from '../product.model';
import * as fromActions from '../ngrx/actions/header.actions';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products$: Observable<Product[]> | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    private store: Store
  ) {
    // Update header title
    this.store.dispatch(fromActions.updateHeaderTitle({ title: 'Products' }));
  }

  ngOnInit() {
    this.products$ = this.productService
      .getProducts()
      .pipe(map((products) => products.slice().sort((a, b) => b.id - a.id)));
  }

  editProduct(id: number) {
    this.router.navigateByUrl(`/products/${id}`);
  }

  addProduct() {
    this.router.navigateByUrl(`/add-product`);
  }
}

```

## Load Products example

### 1. Create Action Types (ngrx\actions\product.actions.ts)

Here we define three actions:

- One for initiating the product load,
- One for handling the success response,
- And one for dealing with errors.

```
import { createAction, props } from '@ngrx/store';
import { Product } from '../../product.model';

export const loadProducts = createAction('[Product List] Load Products');
export const loadProductsSuccess = createAction(
  '[Product List] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product List] Load Products Failure',
  props<{ error: any }>()
);

```

- loadProducts initiates the process.
- loadProductsSuccess carries the product data if successful.
- loadProductsFailure handles any errors during the process.

### 2. Create Product Reducer (ngrx\reducers\product.reducers.ts)

The reducer manages the state changes based on the dispatched actions. This includes updating the product list, managing loading states, and handling errors.

```
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

```

- The loading flag is set when the process starts, and reset when the process completes.
- The error state is updated if there’s a failure.

### 3. Create Product Selectors (ngrx\selectors\product.selectors.ts)

Selectors provide an easy way to access different parts of the product state. Here, we create selectors to get the products, loading state, and any errors.

```
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProductState } from '../reducers/product.reducers';

export const selectProductState =
  createFeatureSelector<ProductState>('products');

export const selectAllProducts = createSelector(
  selectProductState,
  (state: ProductState) => state.products
);

export const selectProductsLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state: ProductState) => state.error
);

```

- selectAllProducts: Retrieves the full list of products.
- selectProductsLoading: Retrieves the loading state.
- selectProductsError: Retrieves any error messages.

### 4. Create Product Effects (ngrx\effects\product.effects.ts)

Effects handle side effects, such as API calls. Here, we use an effect to fetch products from a service and dispatch either a success or failure action.

Key Concepts

- Effects isolate side effects from components, allowing for more pure components that select state and dispatch - actions.
- Effects are long-running services that listen to an observable of every action dispatched from the Store.
- Effects filter those actions based on the type of action they are interested in. This is done by using an operator.
- Effects perform tasks, which are synchronous or asynchronous and return a new action.

```
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

```

- ofType(ProductActions.loadProducts): Listens for the loadProducts action.
- On success, it dispatches loadProductsSuccess.
- On error, it dispatches loadProductsFailure.

### 5. Update app.config.ts for NgRx integration

Configure the store and effects in the app's global configuration:

```
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { headerReducer } from './ngrx/reducers/header.reducer';
import { provideEffects } from '@ngrx/effects';
import { loadProductsEffect } from './ngrx/effects/product.effects';
import { productReducer } from './ngrx/reducers/product.reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
        header: headerReducer,
        products: productReducer,
    }),
    provideEffects({ loadProductsEffect }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};

```

### 6. Update product-list.component.ts to utilize selectors

Here, we dispatch the action to load products and use selectors to get the loading state and products from the store:

```
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Product } from '../product.model';
import * as fromActions from '../ngrx/actions/header.actions';
import * as ProductActions from '../ngrx/actions/product.actions';
import { selectAllProducts, selectProductsLoading } from '../ngrx/selectors/product.selectors';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]> | undefined;
  loading$: Observable<boolean> | undefined;

  constructor(
    private router: Router,
    private store: Store
  ) {
    // Update header title
    this.store.dispatch(
      fromActions.updateHeaderTitle({ title: 'Products' })
    );
  }

  ngOnInit() {
    // Dispatch action to load products
    this.store.dispatch(ProductActions.loadProducts());

    // Select products and loading state from the store
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
  }

  editProduct(id: number) {
    this.router.navigateByUrl(`/products/${id}`);
  }

  addProduct() {
    this.router.navigateByUrl(`/add-product`);
  }
}
```
