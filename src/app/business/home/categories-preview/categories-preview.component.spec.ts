import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesPreviewComponent } from './categories-preview.component';

describe('CategoriesPreviewComponent', () => {
  let component: CategoriesPreviewComponent;
  let fixture: ComponentFixture<CategoriesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
