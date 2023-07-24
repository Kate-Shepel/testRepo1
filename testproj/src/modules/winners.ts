import Garage from "./garage";
import storage from "./storageVars";
import Api from "./apiRequests";
import clearBody from "./utils";

class Winners {
  renderWinnersTable() {
    return `
    <table class="winners-table">
    <thead>
      <th>Number</th>
      <th>Car</th>
      <th>Name</th>
      <th>Wins</th>
      <th>Best time (sec)</th>
    </thead>
    <tbody>
      ${storage.winners
        .map(
          (winner, i) => `
      <tr>
        <td>${i + 1}</td>
        <td class="pic-win">${Garage.renderCarPic(winner.car.color)}</td>
        <td>${winner.car.name}</td>
        <td>${winner.wins}</td>
        <td>${winner.time}</td>
      </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
    `;
  }

  renderWinnersSection() {
    clearBody();
    const winnersHtml = `
      <div class="menu-buttons">
        <button class="button garage-button">To Garage</button>
        <button class="button winners-button">To Winners</button>
      </div>
      <h1>Winners (${storage.winnersTotal})</h1>
      <p class="page-number">Page #${storage.winnersPage}</p>
      ${this.renderWinnersTable()}
      <div class="page-buttons">
      <button class="button prevpage-button">Prev</button>
      <button class="button nextpage-button">Next</button>
    </div>
    `;
    const div = document.createElement("div");
    div.classList.add("container");
    div.innerHTML = winnersHtml;
    document.body.appendChild(div);
    this.addPagination();
  }

  async addPagination() {
    const { items, count } = await Api.getWinners({
      page: storage.winnersPage,
    });
    storage.winners = items;
    storage.winnersTotal = count;

    if (storage.winnersPage * 10 < storage.winnersTotal!) {
      const nextButton = document.querySelector(
        ".nextpage-button"
      ) as HTMLButtonElement;
      nextButton.disabled = false;
      nextButton.onclick = async () => {
        storage.winnersPage += 1;
        await this.addPagination();
        this.renderWinnersSection();
      };
    } else {
      const nextButton = document.querySelector(
        ".nextpage-button"
      ) as HTMLButtonElement;
      nextButton.disabled = true;
    }
    if (storage.winnersPage > 1) {
      const prevButton = document.querySelector(
        ".prevpage-button"
      ) as HTMLButtonElement;
      prevButton.disabled = false;
      prevButton.onclick = async () => {
        storage.winnersPage -= 1;
        await this.addPagination();
        this.renderWinnersSection();
      };
    } else {
      const prevButton = document.querySelector(
        ".prevpage-button"
      ) as HTMLButtonElement;
      prevButton.disabled = true;
    }
  }
}

export default new Winners();
