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
