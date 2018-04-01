import gql from 'graphql-tag';

export const NEW_LOG = gql`
  mutation createNewLog(
    $startTime: String!
    $endTime: String!
    $date: String!
    $duration: Float!
    $project: String!
    $note: String!
  ) {
    createLog(
      input: {
        log: {
          startTime: $startTime
          endTime: $endTime
          date: $date
          duration: $duration
          project: $project
          note: $note
        }
      }
    ) {
      log {
        id
        startTime
        endTime
        date
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
    $startTime: String
    $endTime: String
    $date: String
    $duration: Int
    $project: String
    $note: String
  ) {
    updateLog(
      input: {
        id: $id
        patch: {
          startTime: $startTime
          endTime: $endTime
          date: $date
          duration: $duration
          project: $project
          note: $note
        }
      }
    ) {
      log {
        id
        startTime
        endTime
        date
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
        date
        project {
          id
          name
        }
      }
    }
  }
`;
