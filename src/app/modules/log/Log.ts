import Project from '../project/Project';

export default class Log {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  note: string;
  project: Project;
  // user: User;
  createdAt: string;
  updatedAt: string;
}
