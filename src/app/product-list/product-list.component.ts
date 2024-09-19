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
