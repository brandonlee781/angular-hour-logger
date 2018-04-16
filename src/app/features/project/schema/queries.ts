import Project from 'features/project/Project';
import gql from 'graphql-tag';

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
