import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { Product } from '../product.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockStore } from '@ngrx/store/testing';
import { ProductService } from '../product.service';
import * as fromActions from '../ngrx/actions/header.actions';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let router: Router;
  let store: MockStore;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  const mockProducts: Product[] = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 10 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 20 },
  ];

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);

    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy() } }, 
        { provide: Store, useValue: { dispatch: jasmine.createSpy() } }, 
        { provide: ProductService, useValue: productServiceSpy }, 
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(Store) as MockStore;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productServiceSpy.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    expect(component.products$).toBeDefined();
    expect(component.products$ instanceof Observable).toBe(true);
    component.products$!.subscribe(products => {
      expect(products.length).toEqual(mockProducts.length);
      const sortedProducts = products.sort((a, b) => a.id - b.id);
      sortedProducts.forEach((product, index) => {
        expect(product.id).toEqual(mockProducts[index].id);
        expect(product.name).toEqual(mockProducts[index].name);
        expect(product.description).toEqual(mockProducts[index].description);
        expect(product.price).toEqual(mockProducts[index].price);
      });
    });
  });

  it('should dispatch updateHeaderTitle action with correct title', () => {
    expect(store.dispatch).toHaveBeenCalledWith(fromActions.updateHeaderTitle({ title: 'Products' }));
  });

  it('should navigate to edit product route when editProduct is called', () => {
    const productId = 1;
    component.editProduct(productId);
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/products/${productId}`);
  });

  it('should navigate to add product route when addProduct is called', () => {
    component.addProduct();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/add-product');
  });
});
