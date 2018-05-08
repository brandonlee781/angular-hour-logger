import Task from 'features/project/Task';
import gql from 'graphql-tag';

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

export const NEW_TASK = gql`
  mutation CreateTask(
    $text: String!
    $project: String!
    $estimate: Float
    $priority: Int
    $parent: String
  ) {
    createTask(
      input: {
        task: {
          text: $text
          project: $project
          estimate: $estimate
          parent: $parent
          priority: $priority
        }
      }
    ) {
      task {
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

export const TOGGLE_TASK = gql`
  mutation ToggleTask($id: String) {
    toggleTask(input: { id: $id }) {
      task {
        id
        text
        completed
      }
    }
  }
`;

export interface ToggleTaskQuery {
  toggleTask: {
    task: Task;
  };
}

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(input: { id: $id }) {
      task {
        text
        completed
      }
    }
  }
`;

export interface DeleteTaskQuery {
  deleteTask: {
    task: Task;
  };
}
