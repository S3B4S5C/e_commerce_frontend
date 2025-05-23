import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSuccesComponent } from './order-succes.component';

describe('OrderSuccesComponent', () => {
  let component: OrderSuccesComponent;
  let fixture: ComponentFixture<OrderSuccesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSuccesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSuccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
