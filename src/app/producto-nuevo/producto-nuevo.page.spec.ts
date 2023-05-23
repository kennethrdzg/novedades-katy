import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoNuevoPage } from './producto-nuevo.page';

describe('ProductoNuevoPage', () => {
  let component: ProductoNuevoPage;
  let fixture: ComponentFixture<ProductoNuevoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProductoNuevoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
