import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from './product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve products from the API via GET', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', description: 'Description 1', price: 10 },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 20 },
    ];

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should retrieve one product from the API via GET', () => {
    const productId = 1;
    const mockProduct: Product = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
    };

    service.getProduct(productId).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/products/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should add a product to the API via POST', () => {
    const productId = 1;
    const mockProduct: Product = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
    };

    service.addProduct(mockProduct).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/products`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should update a product to the API via PUT', () => {
    const productId = 1;
    const mockProduct: Product = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
    };

    service.updateProduct(mockProduct).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/products/${productId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should delete a product to the API via PUT', () => {
    const productId = 1;
    const mockProduct: Product = {
      id: productId,
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
    };

    service.deleteProduct(productId).subscribe((product) => {
      expect(product.id).toBe(1);
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${service.apiUrl}/products/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProduct);
  });
});
