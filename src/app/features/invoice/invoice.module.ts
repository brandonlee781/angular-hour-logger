import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { LineChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { InvoiceRoutingModule } from 'features/invoice/invoice-routing.module';
import { UIModule } from 'features/ui/ui.module';

import { InvoiceDocumentComponent } from './components/invoice-document/invoice-document.component';
import { InvoiceStatsComponent } from './components/invoice-stats/invoice-stats.component';
import { InvoiceTableComponent } from './components/invoice-table/invoice-table.component';
import { NewInvoiceDialogComponent } from './components/new-invoice-dialog/new-invoice-dialog.component';
import { BlankInvoicePage } from './pages/blank-invoice/blank-invoice.page';
import { InvoiceDetailPage } from './pages/invoice-detail/invoice-detail.page';
import { InvoicesPage } from './pages/invoices/invoices.page';
import { FavoritesPipe } from './pipes/favorites.pipe';

@NgModule({
  imports: [
    CommonModule,
    EcoFabSpeedDialModule,
    FormsModule,
    ReactiveFormsModule,
    GraphqlModule,
    InvoiceRoutingModule,
    MaterialModule,
    UIModule,
    PieChartModule,
    LineChartModule,
  ],
  entryComponents: [NewInvoiceDialogComponent],
  declarations: [
    InvoiceDetailPage,
    BlankInvoicePage,
    InvoicesPage,
    NewInvoiceDialogComponent,
    InvoiceTableComponent,
    InvoiceDocumentComponent,
    InvoiceStatsComponent,
    FavoritesPipe,
  ],
})
export class InvoiceModule {}
