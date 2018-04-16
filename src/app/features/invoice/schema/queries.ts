import Invoice from 'features/invoice/Invoice';
import gql from 'graphql-tag';

export const GET_ALL_INVOICES = gql`
  query AllInvoices {
    allInvoices {
      invoices {
        id
        number
        hours
        rate
        date
        logs {
          id
          start
          end
          duration
          project {
            id
            name
            color
          }
          note
        }
      }
    }
  }
`;
export interface GetAllInvoicesQuery {
  allInvoices: {
    invoices: Invoice[];
  };
}

export const GET_INVOICE = gql`
  query OneInvoice($id: ID!) {
    oneInvoice(input: { id: $id }) {
      invoice {
        id
        number
        hours
        rate
        date
        logs {
          id
          start
          end
          duration
          project {
            id
            name
            color
          }
          note
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export interface GetInvoiceQuery {
  oneInvoice: {
    invoice: Invoice;
  };
}
