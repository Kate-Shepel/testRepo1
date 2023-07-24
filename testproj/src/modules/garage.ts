import storage from "./storageVars";
import { ICar } from "./types";
import Api from "./apiRequests";
import clearBody, { generateCars } from "./utils";

class Garage {
  selectedCarId: number | null = null;

  renderCarPic(color: string) {
    return `
    <svg class="car-svg" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="enable-background:new 0 0 20.07 20.07" viewBox="0 0 20.07 20.07"><path d="M20.07 10.102s-.719-1.593-5.363-1.53c0 0-4.626-4.644-13.986.582 0 0 .205 1.018-.566 1.018-.159.765-.322 1.769.203 2.294h1.266a1.722 1.722 0 1 1 3.356 0h9.744a1.722 1.722 0 0 1 1.678-2.103c1.297 0 2.037 1.318 1.906 2.092l1.762-.182c-.269-1.586 0-2.171 0-2.171zM6.936 8.835H2.829s1.703-.798 4.107-1.261v1.261zm.891 0V7.427c3.442-.498 6.143 1.408 6.143 1.408H7.827z" style="fill:${color}"/><path d="M16.402 10.742a1.33 1.33 0 0 0 0 2.659c.734 0 1.514-.596 1.514-1.329 0-.736-.779-1.33-1.514-1.33zm0 1.84a.511.511 0 1 1-.001-1.023.511.511 0 0 1 .001 1.023zM3.268 10.742a1.33 1.33 0 1 0 0 2.658 1.33 1.33 0 0 0 0-2.658zm0 1.84a.512.512 0 1 1 0-1.024.512.512 0 0 1 0 1.024z" style="fill:${color}"/></svg>
    `;
  }

  renderCarTrack({ id, name, color }: ICar) {
    return `
    <div class="car-buttons">
      <button class="button select-button" id="select-${id}">Select</button>
      <button class="button remove-button" id="remove-${id}">Remove</button>
      <span class="car-model">${name}</span>
    </div>
    <div class="car-track">
      <div class="start-track">
        <div class="car-controls">
          <button type="button" class="start-button start-car-${id}">A</button>
          <button type="button" class="stop-button stop-car-${id}" disabled>B</button>
        </div>
        <div class="car car-${id}">
          ${this.renderCarPic(color)}
        </div>
      </div>
      <div class="flag flag-${id}" style="color: #fb2904;">	&#9873; </div>
    </div>
    <div class="line"></div>
    `;
  }

  renderControlsBlock() {
    return `
    <div class="controls-block">
      <div class="changes">
        <form class="create-form">
          <input class="create-name" name="name" type="text">
          <input class="create-color" name="color" type="color" value="#f4fc5b">
          <button class="button create-button" type="submit">Create</button>
        </form>
        <form class="update-form">
          <input class="update-name" name="name" type="text" disabled>
          <input class="update-color" name="color" type="color" value="#f4fc5b" disabled>
          <button class="button update-button" type="submit">Update</button>
        </form>
      </div>
      <div class="controls-buttons">
        <button class="button race-button">Race</button>
        <button class="button reset-button">Reset</button>
        <button class="button generate-button">Generate cars</button>
      </div>
    </div>
    `;
  }

  renderCarsList() {
    return `
    <ul class="cars-list">
    ${storage.cars
      .map(
        (car: ICar) => `
        <li class="car-item">${this.renderCarTrack(car)}</li>
        `
      )
      .join("")}
    </ul>
    `;
  }

  async renderGarageSection() {
    clearBody();
    const garageHtml = `
    <div class="menu-buttons">
      <button class="button garage-button">To Garage</button>
      <button class="button winners-button">To Winners</button>
    </div>
    ${this.renderControlsBlock()}
    <h1>Garage (${storage.carsTotal})</h1>
    <p class="page-number">Page #${storage.carsPage}</p>
    ${this.renderCarsList()}
    <div class="page-buttons">
      <button class="button prevpage-button">Prev</button>
      <button class="button nextpage-button">Next</button>
    </div>
    `;
    const div = document.createElement("div");
    div.classList.add("container");
    div.innerHTML = garageHtml;
    document.body.appendChild(div);
    const createButton = document.querySelector(".create-button");
    if (createButton)
      createButton.addEventListener("click", (event) => {
        event.preventDefault();
        this.createNewCar();
      });
    const removeButtons = document.querySelectorAll(".remove-button");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = Number((<HTMLElement>event.target).id.split("-")[1]);
        console.log(id);
        this.deleteCar(id);
      });
    });
    this.selectCar();
    this.updateCar();
    this.addPagination();
    this.loadInputValues();
    const generateButton = document.querySelector(".generate-button");
    if (generateButton)
      generateButton.addEventListener("click", () =>
        this.generateAndCreateCars()
      );
  }

  async createNewCar() {
    const nameInput = document.querySelector(
      ".create-name"
    ) as HTMLInputElement;
    const colorInput = document.querySelector(
      ".create-color"
    ) as HTMLInputElement;
    if (!nameInput || !colorInput) {
      console.error("Cannot find inputs");
      return;
    }
    const body = {
      name: nameInput.value,
      color: colorInput.value,
    };
    const newCar = await Api.createNewCar(body);
    storage.cars.push(newCar);
    storage.carsTotal += 1;
    this.renderGarageSection();
  }

  async deleteCar(id: number) {
    const carToDelete = await Api.deleteCar(id);
    storage.cars.pop(carToDelete);
    storage.carsTotal -= 1;
    this.renderGarageSection();
  }

  async selectCar() {
    const selectButtons = document.querySelectorAll(".select-button");
    selectButtons.forEach((button) => {
      button.addEventListener("click", async (event: Event) => {
        const { target } = event;
        if (!target) return;
        const buttonElement = target as HTMLButtonElement;
        const id = Number(buttonElement.id.split("-")[1]);
        const car = await Api.getCar(id);
        this.selectedCarId = id;
        const nameInput = document.querySelector(
          ".update-name"
        ) as HTMLInputElement;
        const colorInput = document.querySelector(
          ".update-color"
        ) as HTMLInputElement;
        if (!nameInput || !colorInput) {
          console.error("Cannot find form inputs");
          return;
        }
        nameInput.disabled = false;
        colorInput.disabled = false;
        nameInput.value = car.name;
        colorInput.value = car.color;
      });
    });
  }

  async updateCar() {
    const updateButton = document.querySelector(".update-button");
    if (updateButton)
      updateButton.addEventListener("click", async (event) => {
        event.preventDefault();
        if (this.selectedCarId === null) {
          console.error("No car selected");
          return;
        }
        const nameInput = document.querySelector(
          ".update-name"
        ) as HTMLInputElement;
        const colorInput = document.querySelector(
          ".update-color"
        ) as HTMLInputElement;
        if (!nameInput || !colorInput) {
          console.error("Cannot find form inputs");
          return;
        }
        const body = {
          name: nameInput.value,
          color: colorInput.value,
        };
        await Api.updateCar(this.selectedCarId, body);
        const updatedCar = await Api.getCar(this.selectedCarId);
        const carIndex = storage.cars.findIndex(
          (car: ICar) => car.id === this.selectedCarId
        );
        if (carIndex !== -1) {
          storage.cars[carIndex] = updatedCar;
        }
        this.renderGarageSection();
      });
  }

  async addPagination() {
    const { items, count } = await Api.getCars(storage.carsPage);
    storage.cars = items;
    storage.carsTotal = count;

    if (storage.carsPage * 7 < storage.carsTotal!) {
      const nextButton = document.querySelector(
        ".nextpage-button"
      ) as HTMLButtonElement;
      nextButton.disabled = false;
      nextButton.onclick = async () => {
        storage.carsPage += 1;
        await this.addPagination();
        this.renderGarageSection();
      };
    } else {
      const nextButton = document.querySelector(
        ".nextpage-button"
      ) as HTMLButtonElement;
      nextButton.disabled = true;
    }
    if (storage.carsPage > 1) {
      const prevButton = document.querySelector(
        ".prevpage-button"
      ) as HTMLButtonElement;
      prevButton.disabled = false;
      prevButton.onclick = async () => {
        storage.carsPage -= 1;
        await this.addPagination();
        this.renderGarageSection();
      };
    } else {
      const prevButton = document.querySelector(
        ".prevpage-button"
      ) as HTMLButtonElement;
      prevButton.disabled = true;
    }
  }

  async generateAndCreateCars() {
    const newCars = generateCars();
    await Promise.all(
      newCars.map(async (car) => {
        await Api.createNewCar(car);
        storage.carsTotal += 1;
      })
    );
    const { items } = await Api.getCars(storage.carsPage);
    storage.cars = items;
    this.renderGarageSection();
  }

  saveInputValues() {
    const createNameInput = document.querySelector(
      ".create-name"
    ) as HTMLInputElement;
    const createColorInput = document.querySelector(
      ".create-color"
    ) as HTMLInputElement;
    const updateNameInput = document.querySelector(
      ".update-name"
    ) as HTMLInputElement;
    const updateColorInput = document.querySelector(
      ".update-color"
    ) as HTMLInputElement;
    if (createNameInput) storage.inputValues.createName = createNameInput.value;
    if (createColorInput)
      storage.inputValues.createColor = createColorInput.value;
    if (updateNameInput) {
      storage.inputValues.updateName = updateNameInput.value;
      storage.inputValues.updateNameDisabled = updateNameInput.disabled;
    }
    if (updateColorInput) {
      storage.inputValues.updateColor = updateColorInput.value;
      storage.inputValues.updateColorDisabled = updateColorInput.disabled;
    }
  }

  loadInputValues() {
    const createNameInput = document.querySelector(
      ".create-name"
    ) as HTMLInputElement;
    const createColorInput = document.querySelector(
      ".create-color"
    ) as HTMLInputElement;
    const updateNameInput = document.querySelector(
      ".update-name"
    ) as HTMLInputElement;
    const updateColorInput = document.querySelector(
      ".update-color"
    ) as HTMLInputElement;
    if (createNameInput) createNameInput.value = storage.inputValues.createName;
    if (createColorInput)
      createColorInput.value = storage.inputValues.createColor;
    if (updateNameInput) {
      updateNameInput.value = storage.inputValues.updateName;
      updateNameInput.disabled = storage.inputValues.updateNameDisabled;
    }
    if (updateColorInput) {
      updateColorInput.value = storage.inputValues.updateColor;
      updateColorInput.disabled = storage.inputValues.updateColorDisabled;
    }
  }
}

export default new Garage();
