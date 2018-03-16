import gql from 'graphql-tag';

export const getAllLogs = gql`
  query AllLogs{
    allLogs{
      logs {
        id
      }
    }
  }
`;

export const GET_PROJECT_NAMES = gql`
  query AllProjectNames {
    allProjects {
      projects {
        id
        name
      }
    }
  }
`;

export const LOG_LIST_QUERY = gql`
  query LogListQuery($project: String, $offset: Int, $limit: Int) {
    allLogsByProjectId(
      input:{ id: $project }
      options: { limit: $limit, offset: $offset }
    ) {
      logs {
        id
        date
        startTime
        endTime
        duration
        note
        project {
          name
          color
        }
      }
    }
  }
`;
