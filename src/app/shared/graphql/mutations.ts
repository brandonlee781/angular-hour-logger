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
