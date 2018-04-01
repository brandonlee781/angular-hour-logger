import Log from 'features/log/Log';
import Project from 'features/project/Project';
import { User } from 'features/User';
import gql from 'graphql-tag';

export const getAllLogs = gql`
  query AllLogs {
    allLogs {
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
export interface GetProjectNameQuery {
  allProjects: {
    projects: Project[];
  };
}

export const LOG_LIST_QUERY = gql`
  query LogListQuery($project: String, $offset: Int, $limit: Int) {
    allLogsByProjectId(
      input: { id: $project }
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
          id
          name
          color
        }
      }
    }
  }
`;
export interface LogListQuery {
  allLogsByProjectId: {
    logs: Log[];
  };
}

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      email
    }
  }
`;
export interface GetUserQuery {
  getUser: User;
}
