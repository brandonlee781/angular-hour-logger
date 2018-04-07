import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvoiceDialogComponent } from './new-invoice-dialog.component';

describe('NewInvoiceDialogComponent', () => {
  let component: NewInvoiceDialogComponent;
  let fixture: ComponentFixture<NewInvoiceDialogComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [NewInvoiceDialogComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
