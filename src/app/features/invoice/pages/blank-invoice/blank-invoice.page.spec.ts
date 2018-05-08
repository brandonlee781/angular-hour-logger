import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankInvoicePage } from './blank-invoice.page';

describe('BlankInvoicePage', () => {
  let component: BlankInvoicePage;
  let fixture: ComponentFixture<BlankInvoicePage>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [BlankInvoicePage],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
