import { Component, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { finalize, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import * as fromActions from '../ngrx/actions/header.actions';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  productForm: FormGroup;
  product!: Product;
  loading = false;

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    public _ngZone: NgZone,
    private router: Router,
    private dialog: MatDialog,
    private store: Store
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
    });
    this.store.dispatch(
      fromActions.updateHeaderTitle({ title: 'Edit Product' })
    );
  }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(productId);
  }

  loadProduct(productId: number): void {
    this.loading = true;
    this.productService
      .getProduct(productId)
      .pipe(
        take(1),
        finalize(() => this.loading = false)) 
      .subscribe({
        next: (product: Product) => {
          this.product = product;
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
          });
          this.loading = false;
          this.triggerResize();
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.loading = false;
        },
      });
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      const formData = {
        ...this.productForm.value,
        id: this.product?.id,
      } as Product;

      this.loading = true;
      this.productService
        .updateProduct(formData)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.productForm.reset();
            this.router.navigateByUrl(`/`);
          },
          error: (error) => {
            this.loading = false;
          },
        });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigateByUrl(`/`);
  }

  deleteProduct(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this product?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.performDeleteAction();
      }
    });
  }

  private performDeleteAction(): void {
    this.loading = true;
    this.productService
      .deleteProduct(this.product.id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigateByUrl(`/`);
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }
}
