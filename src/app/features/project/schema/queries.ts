import Project from 'features/project/Project';
import Task from 'features/project/Task';
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

export const GET_PROJECT_TASK = gql`
  query ProjectTasks($project: String!, $limit: Int, $offset: Int) {
    projectTasks(
      input: { project: $project }
      options: { limit: $limit, offset: $offset }
    ) {
      tasks {
        id
        text
        completed
        estimate
        priority
        children {
          id
          text
          completed
          estimate
          priority
          children {
            id
            text
            completed
            estimate
            priority
            children {
              id
              text
              completed
              estimate
              priority
              children {
                id
                text
                completed
                estimate
                priority
                children {
                  id
                  text
                  completed
                  estimate
                  priority
                  children {
                    id
                    text
                    completed
                    estimate
                    priority
                  }
                }
              }
            }
          }
        }
        project {
          id
          name
          color
        }
      }
    }
  }
`;

export interface GetProjectTasksQuery {
  projectTasks: {
    tasks: Task[];
  };
}
