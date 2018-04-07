import Log from 'features/log/Log';
import { User } from 'features/User';

export default class Invoice {
  id?: string;
  number?: number;
  date?: string;
  logs?: Log[];
  hours?: number;
  rate?: number;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}
