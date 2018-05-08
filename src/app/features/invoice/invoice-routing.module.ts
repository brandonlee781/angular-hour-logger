import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankInvoicePage } from 'features/invoice/pages/blank-invoice/blank-invoice.page';
import { InvoiceDetailPage } from 'features/invoice/pages/invoice-detail/invoice-detail.page';
import { InvoicesPage } from 'features/invoice/pages/invoices/invoices.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicesPage,
    children: [
      {
        path: '',
        component: BlankInvoicePage,
      },
      {
        path: ':invoice',
        component: InvoiceDetailPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {}
