import {User} from "./user.model";

export interface Round {
  nrCarti: number;
  jucator: User;
  jucatori: User[];
  nrPariuri: number;
  sumaPariuri: number;
  betsLoading: boolean;
  pointsLoading: boolean;
}
