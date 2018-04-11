import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateInvoiceComponent } from './empty-state-invoice.component';

describe('EmptyStateInvoiceComponent', () => {
  let component: EmptyStateInvoiceComponent;
  let fixture: ComponentFixture<EmptyStateInvoiceComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [EmptyStateInvoiceComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
