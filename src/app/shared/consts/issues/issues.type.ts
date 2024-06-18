import { Status } from '../../types';

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: Status;
  numEvents: number;
  numUsers: number;
  value: number;
};
