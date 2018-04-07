import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { InvoiceRoutingModule } from 'features/invoice/invoice-routing.module';
import { SharedModule } from 'shared/shared.module';

import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { InvoiceTableComponent } from './components/invoice-table/invoice-table.component';
import { NewInvoiceDialogComponent } from './components/new-invoice-dialog/new-invoice-dialog.component';
import { InvoicePage } from './pages/invoice/invoice.page';

@NgModule({
  imports: [
    CommonModule,
    EcoFabSpeedDialModule,
    FormsModule,
    ReactiveFormsModule,
    GraphqlModule,
    InvoiceRoutingModule,
    MaterialModule,
    SharedModule,
  ],
  entryComponents: [NewInvoiceDialogComponent],
  declarations: [
    InvoicePage,
    InvoiceDetailComponent,
    NewInvoiceDialogComponent,
    InvoiceTableComponent,
  ],
})
export class InvoiceModule {}