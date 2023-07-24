import Garage from "./garage";
import Winners from "./winners";
import clearBody from "./utils";

class PageManager {
  async init() {
    Garage.renderGarageSection();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener("click", (event: Event) => {
      if ((<HTMLElement>event.target).classList.contains("garage-button")) {
        clearBody();
        Garage.renderGarageSection();
      } else if (
        (<HTMLElement>event.target).classList.contains("winners-button")
      ) {
        Garage.saveInputValues();
        clearBody();
        Winners.renderWinnersSection();
      }
    });
  }
}

export default new PageManager();
