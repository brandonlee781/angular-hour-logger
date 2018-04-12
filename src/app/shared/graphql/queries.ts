import Invoice from 'features/invoice/Invoice';
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
        start
        end
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
      address
      city
      state
      zip
    }
  }
`;
export interface GetUserQuery {
  getUser: User;
}

export const GET_ALL_INVOICES = gql`
  query AllInvoices {
    allInvoices {
      invoices {
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
export interface GetAllInvoicesQuery {
  allInvoices: {
    invoices: Invoice[];
  };
}

export const GET_INVOICE = gql`
  query OneInvoice($id: ID!) {
    oneInvoice(input: { id: $id }) {
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
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export interface GetInvoiceQuery {
  oneInvoice: {
    invoice: Invoice;
  };
}

export const GET_LOGS_BY_DATES = gql`
  query GetLogsByDates(
    $project: [String]
    $start: String
    $end: String
    $limit: Int
    $offset: Int
  ) {
    allLogsByDates(
      input: { project: $project, start: $start, end: $end }
      options: { limit: $limit, offset: $offset }
    ) {
      logs {
        id
        start
        end
        duration
        project {
          id
          color
          name
        }
        note
      }
    }
  }
`;

export interface GetLogsByDatesQuery {
  allLogsByDates: {
    logs: Log[];
  };
}
