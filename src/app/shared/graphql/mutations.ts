import gql from 'graphql-tag';

export const NEW_LOG = gql`
  mutation createNewLog(
    $start: String!
    $end: String!
    $duration: Float!
    $project: String!
    $note: String!
  ) {
    createLog(
      input: {
        log: {
          start: $start
          end: $end
          duration: $duration
          project: $project
          note: $note
        }
      }
    ) {
      log {
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
`;

export const UPDATE_LOG = gql`
  mutation UpdateLog(
    $id: ID!
    $start: String
    $end: String
    $duration: Int
    $project: String
    $note: String
  ) {
    updateLog(
      input: {
        id: $id
        patch: {
          start: $start
          end: $end
          duration: $duration
          project: $project
          note: $note
        }
      }
    ) {
      log {
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
`;

export const DELETE_LOG = gql`
  mutation DeleteLog($logId: ID!) {
    deleteLog(input: { id: $logId }) {
      log {
        note
        project {
          id
          name
        }
      }
    }
  }
`;

export const NEW_PROJECT = gql`
  mutation CreateProject($name: String!, $color: String!) {
    createProject(input: { name: $name, color: $color }) {
      project {
        id
        name
        color
      }
    }
  }
`;

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
