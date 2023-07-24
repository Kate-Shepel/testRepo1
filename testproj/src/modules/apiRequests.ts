import { IWinner, IGetWinnersOptions, IWinnersResponse } from "./types";

const baseServerUrl = "http://127.0.0.1:3000";
const carsPerPage = 7;

const path = {
  garageUrl: `${baseServerUrl}/garage`,
  engineUrl: `${baseServerUrl}/engine`,
  winnersUrl: `${baseServerUrl}/winners`,
};

class Api {
  async getCars(page: number, limit = carsPerPage) {
    const response = await fetch(
      `${path.garageUrl}?_page=${page}&_limit=${limit}`
    );
    console.log(response);

    const items = await response.json();
    const count = await Number(response.headers.get("X-Total-Count"));
    return { items, count };
  }

  async getCar(id: number) {
    return (await fetch(`${path.garageUrl}/${id}`)).json();
  }

  async createNewCar(body: { name: string; color: string }) {
    const response = await fetch(`${path.garageUrl}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  async updateCar(id: number, body: { name: string; color: string }) {
    return (
      await fetch(`${path.garageUrl}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
  }

  async deleteCar(id: number) {
    return (
      await fetch(`${path.garageUrl}/${id}`, { method: "DELETE" })
    ).json();
  }

  async getWinners({
    page,
    limit = 10,
  }: IGetWinnersOptions): Promise<IWinnersResponse> {
    const response = await fetch(
      `${path.winnersUrl}?_page=${page}&_limit=${limit}`
    );
    const items: IWinner[] = await response.json();
    console.log(items);

    return {
      items: await Promise.all(
        items.map(async (winner) => ({
          ...winner,
          car: await this.getCar(winner.id),
        }))
      ),
      count: Number(response.headers.get("X-Total-Count")),
    };
  }
}

export default new Api();
