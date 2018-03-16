import Log from '../log/Log';

export default class Project {
  id: string;
  name: string;
  color: string;
  logs?: Log[];
  // user?: User;
  updatedAt: string;
  createdAt: string;
}
