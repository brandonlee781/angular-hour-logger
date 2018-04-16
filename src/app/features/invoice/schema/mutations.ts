import gql from 'graphql-tag';

export const NEW_INVOICE = gql`
  mutation CreateInvoice(
    $date: String!
    $hours: Float!
    $rate: Int!
    $logs: [ID!]!
  ) {
    createInvoice(
      input: { date: $date, hours: $hours, rate: $rate, logs: $logs }
    ) {
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
        }
      }
    }
  }
`;

export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(input: { id: $id }) {
      invoice {
        number
        hours
        rate
        date
      }
    }
  }
`;
