import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../product.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { Product } from '../product.model';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let router: Router;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let navigateByUrlSpy: jasmine.Spy;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', [
      'getProduct',
      'updateProduct',
      'deleteProduct',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const mockProduct: Product = {
      id: 1,
      name: 'Mock Product',
      description: 'Mock Description',
      price: 10.99,
    };
    productServiceSpy.getProduct.and.returnValue(of(mockProduct));

    await TestBed.configureTestingModule({
      imports: [
        ProductDetailsComponent,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map().set('id', 1) } },
        },
        { provide: Router, useValue: { navigateByUrl: {} } },
        { provide: Store, useValue: { dispatch: jasmine.createSpy() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(
      Promise.resolve(true)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on ngOnInit', () => {
    const dummyProduct = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 20,
    };
    productServiceSpy.getProduct.and.returnValue(of(dummyProduct));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.product).toEqual(dummyProduct);
    expect(component.productForm.value).toEqual({
      name: dummyProduct.name,
      description: dummyProduct.description,
      price: dummyProduct.price,
    });
  });

  it('should call resizeToFitContent on autosize when triggerResize is called', fakeAsync(() => {
    const resizeToFitContentSpy = spyOn(
      component.autosize,
      'resizeToFitContent'
    );
    component.triggerResize();
    component._ngZone.onStable.emit(null);
    tick();
    expect(resizeToFitContentSpy).toHaveBeenCalled();
  }));

  it('should save product', () => {
    const dummyProduct = {
      id: 1,
      name: 'Updated Test Product',
      description: 'Updated Test Description',
      price: 25,
    };
    const formData = {
      name: 'Updated Test Product',
      description: 'Updated Test Description',
      price: 25,
    };
    productServiceSpy.updateProduct.and.returnValue(of(dummyProduct));
    component.product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 20,
    };
    component.productForm.setValue(formData);

    component.saveProduct();

    expect(component.loading).toBeFalse();
    expect(productServiceSpy.updateProduct).toHaveBeenCalled();
    // Form should be reset
    expect(component.productForm.value).toEqual({
      name: null,
      description: null,
      price: null,
    });
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/');
  });

  it('should handle error while saving product', () => {
    productServiceSpy.updateProduct.and.returnValue(throwError(() => 'Error'));
    component.productForm.setValue({
      name: 'Updated Test Product',
      description: 'Updated Test Description',
      price: 25,
    });

    component.saveProduct();

    expect(component.loading).toBeFalse();
    expect(component.productForm.value).toEqual({
      name: 'Updated Test Product',
      description: 'Updated Test Description',
      price: 25,
    });
  });

  it('should cancel', () => {
    component.cancel();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should delete product', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<any, any>);
    const dummyProduct = { id: 1 } as Product;
    productServiceSpy.deleteProduct.and.returnValue(of(dummyProduct));
    component.product = dummyProduct;

    component.deleteProduct();

    expect(component.loading).toBeFalse();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/');
  });

  it('should not delete product when dialog is closed', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(false),
    } as MatDialogRef<any, any>);

    component.deleteProduct();

    expect(component.loading).toBeFalse();
    expect(productServiceSpy.deleteProduct).not.toHaveBeenCalled();
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });

  it('should handle error while deleting product', () => {
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<any, any>);
    productServiceSpy.deleteProduct.and.returnValue(throwError('Error'));

    component.deleteProduct();

    expect(component.loading).toBeFalse();
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });
});
