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