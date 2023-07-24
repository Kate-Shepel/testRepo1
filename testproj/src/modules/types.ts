export interface ICar {
  name: string;
  color: string;
  id: number;
}

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IGetWinnersOptions {
  page: number;
  limit?: number;
}

export interface IWinnersResponse {
  items: (IWinner & { car: ICar })[];
  count: number | null;
}
