import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { loadProductsEffect } from './ngrx/effects/product.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { headerReducer } from './ngrx/reducers/header.reducer';
import { productReducer } from './ngrx/reducers/product.reducers';

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
