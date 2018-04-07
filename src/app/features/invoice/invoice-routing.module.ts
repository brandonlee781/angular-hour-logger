import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicePage } from 'features/invoice/pages/invoice/invoice.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {}
